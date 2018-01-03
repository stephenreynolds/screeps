import { Process } from "OS/Process";
import { BrawlerLifetimeProcess } from "ProcessTypes/Lifetimes/Brawler";
import { Utils } from "Utils/Utils";
import { TowerDefenseProcess } from "../BuildingProcesses/TowerDefense";

export class DefenseManagementProcess extends Process
{
    public type = "dm";

    public run()
    {
        const room = Game.rooms[this.metaData.roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);

        if (enemies.length === 0)
        {
            this.completed = true;
            return;
        }

        // Run tower defense
        this.kernel.addProcessIfNotExist(TowerDefenseProcess, "td-" + this.metaData.roomName, 80, {
            roomName: this.metaData.roomName
        });

        // Spawn brawlers
        if (!this.metaData.brawlers)
        {
            this.metaData.brawlers = [];
        }

        const creepNames = Utils.clearDeadCreeps(this.metaData.brawlers);
        this.metaData.brawlers = creepNames;
        const creep = Utils.inflateCreeps(creepNames);

        if (creep.length < enemies.length * 2)
        {
            let spawnRoom = this.metaData.roomName;
            const creepName = `def-brawler-${this.metaData.roomName}-${Game.time}`;
            let spawned = Utils.spawn(this.kernel, spawnRoom, "brawler", creepName, {});

            if (!spawned)
            {
                spawnRoom = Utils.nearestRoom(spawnRoom, 190);
                spawned = Utils.spawn(this.kernel, spawnRoom, "brawler", creepName, {});
            }
            else
            {
                this.metaData.brawlers.push(creepName);
                this.kernel.addProcess(BrawlerLifetimeProcess, `brawlerLifetime-${creepName}`, 49, {
                    creep: creepName,
                    flag: `${this.metaData.roomName}-NAV`
                });
            }
        }
    }
}
