import { Process } from "OS/Process";

import { SpawnRemoteBuilderProcess } from "../System/SpawnRemoteBuilder";

export class BuildSpawnProcess extends Process
{
    public type = "bsp";

    public run()
    {
        if (!this.metaData.siteId)
        {
            const spawnPosition = new RoomPosition(
                this.metaData.pos.x, this.metaData.pos.y, this.metaData.pos.roomName);
            const site = spawnPosition.lookFor(LOOK_CONSTRUCTION_SITES)[0] as ConstructionSite;
            this.metaData.siteId = site.id;

            return;
        }

        const spawnSite = Game.getObjectById(this.metaData.siteId) as ConstructionSite;

        if (!spawnSite)
        {
            this.completed = true;
            return;
        }

        this.fork(SpawnRemoteBuilderProcess, `spawnRemoteBuilder-${this.metaData.pos.roomName}`, this.priority - 1, {
            site: this.metaData.siteId,
            roomName: this.metaData.pos.roomName
        });
    }
}
