import { Process } from "processes/process";

export class TowerDefenseProcess extends Process
{
    public type = "towerdefense";

    public run(): void
    {
        const room = Game.rooms[this.metaData.roomName];

        if (!room)
        {
            this.completed = true;
            return;
        }

        const enemies = room.find(FIND_HOSTILE_CREEPS);

        if (enemies.length > 0)
        {
            _.forEach(this.scheduler.data.roomData[this.metaData.roomName].towers, (tower: StructureTower) =>
            {
                const enemy = tower.pos.findClosestByRange(enemies);
                if (!enemy)
                {
                    return;
                }

                tower.attack(enemy);
            });

            if (!this.metaData.runTime)
            {
                this.metaData.runTime = 0;
            }
            else
            {
                this.metaData.runTime++;
            }
        }
        else
        {
            this.completed = true;
        }
    }
}
