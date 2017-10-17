import { AbstractTask } from "../AbstractTask";

export class RoomDataTask extends AbstractTask
{
    private room: Room;
    private fields = [
        "constructionSites",
        "containers",
        "extensions",
        "labs",
        "links",
        "ramparts",
        "roads",
        "spawns",
        "sources",
        "towers"
    ];
    private singleFields = [
        "extractor",
        "mineral",
        "nuker",
        "powerSpawn"
    ];

    public constructor(room: Room)
    {
        super();
        this.room = room;
    }

    public Initialize(): void
    {
        // Do nothing
    }

    public CheckCreeps(): void
    {
        // Do nothing
    }

    public Run(): void
    {
        this.importFromMemory();
        this.detectHostiles();
    }

    public Finalize(): void
    {
        // Do nothing
    }

    private build(): void
    {
        const structures = this.room.find<Structure>(FIND_STRUCTURES);
        const myStructures = this.room.find<Structure>(FIND_MY_STRUCTURES);

        const containers = _.filter(structures, (s: Structure) => {
            return s.structureType === STRUCTURE_CONTAINER;
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

        const links = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_LINK;
        }) as StructureLink[];

        const nuker = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_NUKER;
        })[0] as StructureNuker;

        const powerSpawn = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_POWER_SPAWN;
        })[0] as StructurePowerSpawn;

        const ramparts = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_RAMPART;
        }) as StructureRampart[];

        const roads = _.filter(structures, (s: Structure) =>
        {
            return s.structureType === STRUCTURE_ROAD;
        }) as StructureRoad[];

        const spawns = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_SPAWN;
        }) as StructureSpawn[];

        const terminal = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_TERMINAL;
        })[0] as StructureTerminal;

        const towers = _.filter(myStructures, (s: Structure) => {
            return s.structureType === STRUCTURE_TOWER;
        }) as StructureTower[];

        const roomData: RoomData = {
            constructionSites: this.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES),
            containers: containers,
            extensions: extensions,
            extractor: extractor,
            mineral: this.room.find<Mineral>(FIND_MINERALS)[0],
            labs: labs,
            links: links,
            nuker: nuker,
            powerSpawn: powerSpawn,
            ramparts: ramparts,
            roads: roads,
            spawns: spawns,
            sources: this.room.find<Source>(FIND_SOURCES),
            terminal: terminal,
            towers: towers
        };

        this.room.memory.cache = {};

        for (const field of this.fields)
        {
            this.room.memory.cache[field] = this.deflate(roomData[field]);
        }

        for (const singleField of this.singleFields)
        {
            this.room.memory.cache[singleField] = roomData[singleField].id;
        }
    }

    private importFromMemory(): void
    {
        if (!this.room.memory.cache)
        {
            this.build();
            return;
        }

        const roomData: RoomData = {
            constructionSites: [],
            containers: [],
            extensions: [],
            extractor: undefined,
            mineral: undefined,
            labs: [],
            links: [],
            nuker: undefined,
            powerSpawn: undefined,
            ramparts: [],
            roads: [],
            spawns: [],
            sources: [],
            terminal: undefined,
            towers: []
        };

        if (this.room.memory.numSites !== Object.keys(Game.constructionSites).length)
        {
            delete this.room.memory.cache.constructionSites;
            this.room.memory.numSites = Object.keys(Game.constructionSites).length;
        }

        let run = true;
        let i = 0;
        while (run)
        {
            const field = this.fields[i];

            if (this.room.memory.cache[field])
            {
                const inflation = this.inflate(this.room.memory.cache[field]);
                if (inflation.rebuild)
                {
                    run = false;
                    this.build();
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
                this.build();
                return;
            }

            i++;
            run = i !== this.fields.length;
        }

        run = true;
        i = 0;
        while (run)
        {
            const field = this.singleFields[i];

            if (this.room.memory.cache[field])
            {
                const object = Game.getObjectById(this.room.memory.cache[field]);

                if (object)
                {
                    roomData[field] = object;
                }
                else
                {
                    run = false;
                    this.build();
                    return;
                }
            }

            i++;
            run = i !== this.singleFields.length;
        }
    }

    private inflate(ids: string[]): { result: Structure[], rebuild: boolean }
    {
        const result: Structure[] = [];
        let rebuild = false;

        for (const id of ids)
        {
            const object = Game.getObjectById<Structure>(id);

            if (object)
            {
                result.push(object);
            }
            else
            {
                rebuild = true;
            }
        }

        return { result: result, rebuild: rebuild };
    }

    private deflate(objects: Structure[]): string[]
    {
        const result: string[] = [];

        for (const object of objects)
        {
            result.push(object.id);
        }

        return result;
    }

    private detectHostiles(): void
    {
        const hostiles = {
            enemies: this.room.find<Creep>(FIND_HOSTILE_CREEPS),
            spawns: this.room.find<Structure>(FIND_HOSTILE_SPAWNS),
            structures: this.room.find<Structure>(FIND_HOSTILE_STRUCTURES)
        };

        this.room.memory.hostiles = hostiles;
    }
}
