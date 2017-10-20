import { LifetimeProcess } from "../../os/LifetimeProcess";

import { DeliverProcess } from "../creepActions/deliver";
import { MineralHarvestProcess } from "../creepActions/mineralHarvest";

export class MineralharvesterLifetimeProcess extends LifetimeProcess
{
  public type = "mhlf";

  public run()
  {
    const creep = this.getCreep();

    if (!creep)
    {
      return;
    }

    if (_.sum(creep.carry) === 0)
    {
      this.fork(MineralHarvestProcess, "mineral-harvest-" + creep.name, this.priority - 1, {
        mineral: this.metaData.mineral,
        extractor: this.metaData.extractor,
        creep: creep.name
      });

      return;
    }

    const mineral = Game.getObjectById(this.metaData.mineral) as Mineral;

    this.fork(DeliverProcess, "deliver-" + creep.name, this.priority - 1, {
      creep: creep.name,
      resource: mineral!.mineralType,
      target: creep.room.storage!.id
    });
  }
}
