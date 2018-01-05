import { Process } from "OS/Process";
import { Utils } from "Utils/Utils";

import { RemoteBuilderLifetimeProcess } from "../Lifetimes/RemoteBuilder";

export class SpawnRemoteBuilderProcess extends Process
{
    public type = "spawnRemoteBuilder";

    public run()
    {
        const site = this.metaData.site;

        if (!site)
        {
            this.completed = true;
            return;
        }

        if (!this.kernel.hasProcess("rblf-rb-" + site))
        {
            const spawned = Utils.spawn(
                this.kernel,
                Utils.nearestRoom(this.metaData.roomName, 500),
                "worker",
                "rb-" + Game.time,
                {}
            );

            if (spawned)
            {
                this.kernel.addProcess(RemoteBuilderLifetimeProcess, "rblf-rb-" + site, 70, {
                    creep: "rb-" + Game.time,
                    site: site
                });
            }
        }

        this.completed = true;
    }
}
