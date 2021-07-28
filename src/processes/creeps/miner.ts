import { DeliverProcess } from "./actions/deliver";
import { HarvestProcess } from "./actions/harvest";
import { MoveProcess } from "./actions/move";
import { UpgradeProcess } from "./actions/upgrade";
import { CreepProcess } from "./creepProcess";
import _ from "lodash";

export class MinerCreepProcess extends CreepProcess {
  public type = "mcreep";

  public run() {
    const creep = this.getCreep();

    if (!creep) {
      return;
    }

    const container = Game.getObjectById<StructureContainer>(this.metaData.container);

    if (container) {
      // Move to source container if on it.
      if (!creep.pos.isEqualTo(container)) {
        this.fork(MoveProcess, `${creep.name}-mine-move`, this.priority - 1, {
          creep: creep.name,
          pos: {
            x: container.pos.x,
            y: container.pos.y,
            roomName: container.pos.roomName
          }
        });

        return;
      }

      // Harvest energy from source.
      if (creep.store.getUsedCapacity() === 0) {
        this.fork(HarvestProcess, `harvest-${creep.name}`, this.priority - 1, {
          source: this.metaData.source,
          creep: creep.name
        });

        return;
      }

      this.transfer(creep, container);
    }
  }

  private transfer(creep: Creep, container: StructureContainer) {
    const links = creep.pos.findInRange(this.scheduler.data.roomData[creep.room.name].links, 1);
    const link = _.find(links, (l: StructureLink) => {
      return l.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    });

    if (creep.memory.linked === undefined) {
      creep.memory.linked = false;
    }

    // Transfer energy to link if it exists, otherwise drop it into container.
    if (link && link.energy < link.energyCapacity && creep.memory.linked === false) {
      // Transfer amount equal to 2.5% of what's in container.
      creep.transfer(link, RESOURCE_ENERGY, Math.max(container.store.getUsedCapacity() * 0.025, 10));
      creep.memory.linked = true;
    }
    else if (container.store.getFreeCapacity() > 0) {
      creep.drop(RESOURCE_ENERGY);
      creep.memory.linked = false;
    }
    else {
      creep.memory.linked = false;

      // Link and container are full, act as courier instead.
      let targets = [].concat(
        this.scheduler.data.roomData[creep.room.name].spawns as never[],
        this.scheduler.data.roomData[creep.room.name].extensions as never[]
      );

      let deliverTargets = _.filter(targets, (t: DeliveryTarget) => {
        return (t.energy < t.energyCapacity);
      });

      if (deliverTargets.length === 0) {
        const targs = [].concat(
          this.scheduler.data.roomData[creep.room.name].towers as never[]
        );

        deliverTargets = _.filter(targs, (t: DeliveryTarget) => {
          return (t.energy < t.energyCapacity - 250);
        });
      }

      if (deliverTargets.length === 0) {
        targets = [].concat(
          this.scheduler.data.roomData[creep.room.name].labs as never[],
          this.scheduler.data.roomData[creep.room.name].generalContainers as never[]
        );

        deliverTargets = _.filter(targets, (t: DeliveryTarget) => {
          if (t.store) {
            return (_.sum(t.store) < t.storeCapacity);
          }
          else {
            return (t.energy < t.energyCapacity);
          }
        });
      }

      const target = creep.pos.findClosestByPath(deliverTargets) as Structure;

      if (target) {
        this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
          creep: creep.name,
          target: target.id,
          resource: RESOURCE_ENERGY
        });
      }
      else {
        // If there is no where to deliver to, upgrade.
        this.fork(UpgradeProcess, creep.name + "-upgrade", this.priority, {
          creep: creep.name
        });
      }
    }
  }
}
