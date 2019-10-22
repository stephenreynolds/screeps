import { CreepProcess } from "./creepProcess";
import { Utils } from "utils/utils";

import { CollectProcess } from "./actions/collect";
import { RepairProcess } from "./actions/repair";

export class RepairerCreepProcess extends CreepProcess {
    public type = "rcreep";

    public run() {
        const creep = this.getCreep();

        if (!creep) {
            return;
        }

        if (_.sum(creep.carry) === 0) {
            const target = Utils.withdrawTarget(creep, this);

            if (target) {
                this.fork(CollectProcess, "collect-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    target: target.id,
                    resource: RESOURCE_ENERGY
                });

                return;
            }
            else {
                this.suspend = 10;
                return;
            }
        }

        // If the creep has been refilled
        let repairTargets: Structure[];
        let shortestDecay = 100;

        const useableTowers = _.filter(this.roomData().towers, (tower: StructureTower) => {
            return tower.energy >= 500;
        });

        if (useableTowers.length === 0) {
            let repairableObjects = [].concat(
                this.scheduler.data.roomData[this.metaData.roomName].containers as never[],
                this.roomData().ramparts as never[]
            ) as Array<StructureRoad | StructureRampart | StructureContainer>;

            repairTargets = _.filter(repairableObjects,
                (object: StructureRoad | StructureRampart | StructureContainer) => {
                    if (object.ticksToDecay < shortestDecay) { shortestDecay = object.ticksToDecay; }

                    if (object.structureType !== STRUCTURE_RAMPART) {
                        return (object.hits < object.hitsMax);
                    }
                    else {
                        return (object.hits < Utils.rampartHealth(this.scheduler, this.metaData.roomName));
                    }
                });

            if (repairTargets.length === 0) {
                repairableObjects = [].concat(
                    this.scheduler.data.roomData[this.metaData.roomName].roads as never[]
                ) as StructureRoad[];

                shortestDecay = 100;

                repairTargets = _.filter(repairableObjects,
                    (object: StructureRoad | StructureRampart | StructureContainer) => {
                        if (object.ticksToDecay < shortestDecay) {
                            shortestDecay = object.ticksToDecay;
                        }

                        if (object.structureType !== STRUCTURE_RAMPART) {
                            return (object.hits < object.hitsMax);
                        }
                        else {
                            return (object.hits < Utils.rampartHealth(this.scheduler, this.metaData.roomName));
                        }
                    });
            }
        }
        else {
            let repairableObjects = [].concat(
                this.roomData().walls as never[]
            ) as Array<StructureWall>;

            repairTargets = _.filter(repairableObjects, (wall: StructureWall) => {
                return wall.hits < wall.hitsMax;
            });
        }

        repairTargets = repairTargets.sort((a, b) => {
            if (a.hits < b.hits) {
                return -1;
            }
            else if (a.hits > b.hits) {
                return 1;
            }
            else {
                return 0;
            }
        });

        if (repairTargets.length > 0) {
            const target = repairTargets[0];

            this.fork(RepairProcess, "repair-" + creep.name, this.priority - 1, {
                creep: creep.name,
                target: target!.id
            });
        }
        else {
            this.suspend = shortestDecay;
            return;
        }
    }
}
