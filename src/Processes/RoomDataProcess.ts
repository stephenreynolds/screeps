import { Process } from "./Process";
import { RoomLayoutProcess } from "./RoomLayoutProcess";
import { TowerDefenseProcess } from "./TowerDefenseProcess";

export class RoomDataProcess extends Process
{
    public type = "roomData";

    private fields = [
        "constructionSites", "containers", "extensions", "extractor", "mineral",
        "labs", "ramparts", "roads", "spawns", "sources", "sourceContainers",
        "towers", "walls"
    ];

    private singleFields = [ "extractor", "mineral" ];

    public run()
    {
        const room = Game.rooms[this.metaData.roomName];

        this.importFromMemory(room);

        if (room.controller!.my)
        {
            this.kernel.addProcessIfNotExist(RoomLayoutProcess, `roomLayout-${room.name}`, 20, {
                roomName: room.name
            });
        }

        this.detectEnemies(room);

        this.completed = true;
    }

    private build(room: Room): void
    {
        const structures = room.find(FIND_STRUCTURES) as Structure[];
        const myStructures = room.find(FIND_MY_STRUCTURES) as Structure[];

        const containers = _.filter(structures, (s: Structure) => {
            return s.structureType === STRUCTURE_CONTAINER;
        }) as StructureContainer[];

        const sourceContainers = _.filter(containers, (c: StructureContainer) => {
            const sources = c.pos.findInRange(FIND_SOURCES, 1);
            return sources.length > 0;
        }) as StructureContainer[];

        const generalContainers = _.filter(containers, (c: StructureContainer) => {
            const matchContainers = [].concat(sourceContainers as never[]);
            const matches = _.filter(matchContainers, (m: StructureContainer) => {
                return m.id === c.id;
            });
            return matches.length === 0;
        }) as StructureContainer[];

        const extensions = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_EXTENSION;
        }) as StructureExtension[];

        const extractor = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_EXTRACTOR;
        })[0] as StructureExtractor;

        const labs = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_LAB;
        }) as StructureLab[];

        const ramparts = _.filter(structures, (s: Structure) => {
            return s.structureType === STRUCTURE_RAMPART;
        }) as StructureRampart[];

        const roads = _.filter(structures, (s: Structure) =>
        {
            return s.structureType === STRUCTURE_ROAD;
        }) as StructureRoad[];

        const towers = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_TOWER;
        }) as StructureTower[];

        const walls = _.filter(structures, (s: Structure) => {
            return s.structureType === STRUCTURE_WALL;
        }) as StructureWall[];

        const roomData: RoomData = {
            constructionSites: room.find(FIND_CONSTRUCTION_SITES),
            containers: containers,
            extensions: extensions,
            extractor: extractor,
            generalContainers: generalContainers,
            mineral: room.find(FIND_MINERALS)[0] as Mineral,
            labs: labs,
            ramparts: ramparts,
            roads: roads,
            spawns: room.find(FIND_MY_SPAWNS),
            sources: room.find(FIND_SOURCES),
            sourceContainers: sourceContainers,
            towers: towers,
            walls: walls
        };

        this.kernel.data.roomData[this.metaData.roomName] = roomData;

        room.memory.cache = {};

        for (const field of this.fields)
        {
            room.memory.cache[field] = this.deflate(roomData[field]);
        }

        for (const field of this.singleFields)
        {
            if (roomData[field].id)
            {
                room.memory.cache[field] = roomData[field].id;
            }
        }
    }

    private importFromMemory(room: Room): void
    {
        const roomData: RoomData = {
            constructionSites: [],
            containers: [],
            extensions: [],
            extractor: undefined,
            generalContainers: [],
            mineral: undefined,
            labs: [],
            ramparts: [],
            roads: [],
            spawns: [],
            sources: [],
            sourceContainers: [],
            towers: [],
            walls: []
        };

        if (room.memory.numSites !== Object.keys(Game.constructionSites).length)
        {
            delete room.memory.cache.constructionSites;
            room.memory.numSites = Object.keys(Game.constructionSites).length;
        }

        let run = true;
        let i = 0;

        while (run)
        {
            const field = this.fields[i];

            if (room.memory.cache[field])
            {
                const inflation = this.inflate(room.memory.cache[field]);
                if (inflation.rebuild)
                {
                    run = false;
                    this.build(room);
                    return;
                }
                else
                {
                    roomData[field] = inflation.result;
                }
            }
            else
            {
                run = false;
                this.build(room);
                return;
            }

            i++;
            run = i === this.fields.length;
        }

        run = true;
        i = 0;

        while (run)
        {
            const field  = this.singleFields[i];

            if (room.memory.cache[field])
            {
                const object = Game.getObjectById(room.memory.cache[field]);

                if (object)
                {
                    roomData[field] = object;
                }
                else
                {
                    run = false;
                    this.build(room);
                    return;
                }
            }

            i++;
            run = i === this.singleFields.length;
        }
    }

    private inflate(ids: string[])
    {
        let rebuild = false;
        const result: Structure[] = [];

        _.forEach(ids, (id) => {
            const object = Game.getObjectById(id) as Structure;

            if (object)
            {
                result.push(object);
            }
            else
            {
                rebuild = true;
            }
        });

        return {
            result: result,
            rebuild: rebuild
        };
    }

    private deflate(objects: Structure[])
    {
        const result: string[] = [];

        _.forEach(objects, (o: Structure) => {
            result.push(o.id);
        });

        return result;
    }

    private detectEnemies(room: Room)
    {
        const enemies = room.find(FIND_HOSTILE_CREEPS) as Creep[];

        if (enemies.length > 0 && !this.kernel.hasProcess(`towerDefense-${this.metaData.roomName}`))
        {
            this.kernel.addProcess(TowerDefenseProcess, `towerDefense-${this.metaData.roomName}`, 80, {
                roomName: this.metaData.roomName
            });
        }
    }
}
