import { Process } from "processes/process";
import { Utils } from "utils/utils";

import { RemoteBuilderCreepProcess } from "../creeps/remoteBuilder";

export class SpawnRemoteBuilderProcess extends Process {
  public type = "spawnRemoteBuilder";

  public run() {
    const site = this.metaData.site;

    if (!site) {
      this.completed = true;
      return;
    }

    if (!this.scheduler.hasProcess("rbcreep-" + site)) {
      const creepName = "rbcreep-" + Game.time;

      const spawned = Utils.spawn(
        this.scheduler,
        Utils.nearestRoom(this.metaData.roomName, 500),
        "worker",
        creepName
      );

      if (spawned) {
        this.scheduler.addProcess(RemoteBuilderCreepProcess, "rbcreep-" + site, 70, {
          creep: creepName,
          site: site
        });
      }
    }

    this.completed = true;
  }
}
