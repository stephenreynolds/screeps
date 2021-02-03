import { BrawlerCreepProcess } from "../creeps/brawler";
import { Process } from "processes/process";
import { TowerDefenseProcess } from "../buildings/towerDefense";
import { Utils } from "utils/utils";

export class DefenseManagementProcess extends Process
{
    public type = "dman";

    public run(): void
    {
        const room = Game.rooms[this.metaData.roomName];
        const enemies = room.find(FIND_HOSTILE_CREEPS);

        if (enemies.length === 0)
        {
            this.completed = true;
            return;
        }

        // Run tower defense
        this.scheduler.addProcessIfNotExist(TowerDefenseProcess, `td-${this.metaData.roomName}`, 80, {
            roomName: this.metaData.roomName
        });

        // Spawn brawlers
        if (!this.metaData.brawlers)
        {
            this.metaData.brawlers = [];
        }

        const creepNames = Utils.getLiveCreeps(this.metaData.brawlers);
        this.metaData.brawlers = creepNames;
        const creep = Utils.inflateCreeps(creepNames);

        if (creep.length < enemies.length * 2)
        {
            let spawnRoom = this.metaData.roomName;
            const creepName = `def-brawler-${this.metaData.roomName}-${Game.time}`;
            let spawned = Utils.spawn(this.scheduler, spawnRoom, "brawler", creepName, {});

            if (!spawned)
            {
                spawnRoom = Utils.nearestRoom(spawnRoom, 190);
                spawned = Utils.spawn(this.scheduler, spawnRoom, "brawler", creepName, {});

                if (spawned)
                {
                    this.metaData.brawlers.push(creepName);
                    this.scheduler.addProcess(BrawlerCreepProcess, `brawlcreep-${creepName}`, 49, {
                        creep: creepName,
                        flag: `${this.metaData.roomName}-NAV`
                    });
                }
            }
            else
            {
                this.metaData.brawlers.push(creepName);
                this.scheduler.addProcess(BrawlerCreepProcess, `brawlcreep-${creepName}`, 49, {
                    creep: creepName,
                    flag: `${this.metaData.roomName}-NAV`
                });
            }
        }
    }
}
