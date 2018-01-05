import { Process } from "OS/Process";

export class TowerRepairProcess extends Process
{
    public type = "towerRepair";

    public run()
    {
        if (!Game.rooms[this.metaData.roomName])
        {
            this.completed = true;
            return;
        }

        if (Game.rooms[this.metaData.roomName].find(FIND_HOSTILE_CREEPS).length > 0)
        {
            return;
        }

        const ramparts = _.filter(this.roomData().ramparts, (rampart: StructureRampart) =>
        {
            return (rampart.hits < 50000);
        });

        const containers = _.filter(this.roomData().generalContainers, (container: StructureContainer) =>
        {
            return (container.hits < container.hitsMax);
        });

        const sourceContainers = _.filter(this.roomData().sourceContainers, (container: StructureContainer) =>
        {
            return (container.hits < container.hitsMax);
        });

        const roads = _.filter(this.roomData().roads, (road: StructureRoad) =>
        {
            return (road.hits < road.hitsMax);
        });

        const walls = _.filter(this.roomData().walls, (w: StructureWall) =>
        {
            return w.hits < w.hitsMax;
        });

        const sortedRamparts = _.sortBy([].concat(
            ramparts as never[],
            containers as never[],
            sourceContainers as never[],
            roads as never[],
            walls as never[]
        ) as Structure[], "hits");
        const usedTowers = {} as { [towerId: string]: boolean };

        _.forEach(this.roomData().towers, (tower: StructureTower) =>
        {
            usedTowers[tower.id] = (tower.energy < 500);
        });

        const proc = this;
        _.forEach(sortedRamparts, (rampart: StructureRampart) =>
        {
            const towers = _.filter(proc.roomData().towers, (tower: StructureTower) =>
            {
                return !usedTowers[tower.id];
            });

            if (towers.length > 0)
            {
                const tower = rampart.pos.findClosestByRange<StructureTower>(towers);

                tower.repair(rampart);

                usedTowers[tower.id] = true;
            }
        });
    }
}
