import { Process } from "processes/process";

export abstract class CreepProcess extends Process {
  public getCreep(): Creep | false {
    const creep = Game.creeps[this.metaData.creep];

    if (creep) {
      return creep;
    }
    else {
      this.completed = true;
      return false;
    }
  }
}
