import { Process } from "../os/process";

import { LinkProcess } from "processTypes/buildingProcesses/LinkProcess";
import { TowerDefenseProcess } from "./buildingProcesses/towerDefense";
import { TowerRepairProcess } from "./buildingProcesses/towerRepair";
import { MineralManagementProcess } from "./management/mineral";
import { RoomLayoutProcess } from "./management/roomLayout";
import { SpawnRemoteBuilderProcess } from "./system/spawnRemoteBuilder";

interface RoomDataMeta
{
  roomName: string;
}

export class RoomDataProcess extends Process
{
  public type = "roomData";

  public metaData: RoomDataMeta;
  public fields = [
    "constructionSites", "containers", "extensions", "generalContainers", "labs",
    "links", "ramparts", "roads", "spawns", "sources", "sourceContainers", "towers"
  ];

  public mapFields = [
    "sourceContainerMaps"
  ];

  public singleFields = [
    "extractor", "mineral", "coreLink"
  ];

  public run()
  {
    const room = Game.rooms[this.metaData.roomName];

    if (!room)
    {
      this.completed = true;
      return;
    }

    this.importFromMemory(room);

    if (this.kernel.data.roomData[this.metaData.roomName].spawns.length === 0)
    {
      const hostiles = room.find(FIND_HOSTILE_CREEPS);
      const spawnSites = _.filter(this.roomData().constructionSites, function(site)
      {
        return (site.structureType === STRUCTURE_SPAWN);
      });

      if (spawnSites.length > 0 && hostiles.length === 0)
      {
        this.kernel.addProcess(SpawnRemoteBuilderProcess, "srm-" + this.metaData.roomName, 90, {
          site: spawnSites[0].id,
          roomName: this.metaData.roomName
        });
      }
    }

    if (room.controller && room.controller.my && this.roomData().mineral &&
        this.roomData().mineral!.mineralAmount > 0 && this.roomData().extractor)
    {
      this.kernel.addProcessIfNotExist(MineralManagementProcess, "minerals-" + this.metaData.roomName, 20, {
        roomName: room.name
      });
    }

    if (room.controller && room.controller.my && room.controller.level >= 2)
    {
      this.kernel.addProcessIfNotExist(RoomLayoutProcess, "room-layout-" + room.name, 20, {
        roomName: room.name
      });
    }

    if (this.kernel.data.roomData[this.metaData.roomName].ramparts.length > 0)
    {
      this.kernel.addProcessIfNotExist(TowerRepairProcess, "tower-repair-" + room.name, 20, {
        roomName: room.name
      });
    }

    if (this.kernel.data.roomData[this.metaData.roomName].links.length > 0)
    {
      this.kernel.addProcessIfNotExist(LinkProcess, `link-${room.name}`, 30, {
        roomName: room.name
      });
    }

    this.enemyDetection(room);

    this.completed = true;
  }

  /** Returns the room data */
  public build(room: Room)
  {
    const structures = room.find(FIND_STRUCTURES) as Structure[];
    const myStructures = room.find(FIND_MY_STRUCTURES) as Structure[];

    const containers = _.filter(structures, function(structure)
    {
      return (structure.structureType === STRUCTURE_CONTAINER);
    }) as StructureContainer[];

    const sourceContainerMaps = {} as { [id: string]: StructureContainer };

    const sourceContainers = _.filter(containers, function(container)
    {
      const sources: Source[] = container.pos.findInRange(FIND_SOURCES, 1);

      if (sources[0])
      {
        sourceContainerMaps[sources[0].id] = container;
      }

      return (sources.length !== 0);
    });

    const generalContainers = _.filter(containers, function(container)
    {
      const matchContainers = [].concat(sourceContainers as never[]) as StructureContainer[];

      const matched = _.filter(matchContainers, function(mc)
      {
        return (mc.id === container.id);
      });

      return (matched.length === 0);
    });

    const roads = _.filter(structures, function(structure)
    {
      return (structure.structureType === STRUCTURE_ROAD);
    }) as StructureRoad[];

    const labs = _.filter(myStructures, function(structure)
    {
      return (structure.structureType === STRUCTURE_LAB);
    }) as StructureLab[];

    const ramparts = _.filter(myStructures, function(structure)
    {
      return (structure.structureType === STRUCTURE_RAMPART);
    }) as StructureRampart[];

    const links = _.filter(structures, function(structure)
    {
      return (structure.structureType === STRUCTURE_LINK);
    }) as StructureLink[];

    let coreLink;
    _.forEach(links, function(link)
    {
      const storages = link.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: function(structure: Structure)
        {
          return (structure.structureType === STRUCTURE_STORAGE);
        }
      });

      if (storages.length === 1)
      {
        coreLink = link;
      }
    });

    const roomData: RoomData = {
      constructionSites: room.find(FIND_CONSTRUCTION_SITES) as ConstructionSite[],
      containers: containers,
      coreLink: coreLink,
      extensions: _.filter(myStructures, function(structure)
      {
        return (structure.structureType === STRUCTURE_EXTENSION);
      }) as StructureExtension[],
      extractor: _.filter(myStructures, function(structure)
      {
        return (structure.structureType === STRUCTURE_EXTRACTOR);
      })[0] as StructureExtractor,
      generalContainers: generalContainers,
      mineral: room.find(FIND_MINERALS)[0] as Mineral,
      labs: labs,
      links: links,
      ramparts: ramparts,
      roads: roads,
      spawns: _.filter(myStructures, function(structure)
      {
        return (structure.structureType === STRUCTURE_SPAWN);
      }) as StructureSpawn[],
      sources: room.find(FIND_SOURCES) as Source[],
      sourceContainers: sourceContainers,
      sourceContainerMaps: sourceContainerMaps,
      towers: _.filter(myStructures, function(structure)
      {
        return (structure.structureType === STRUCTURE_TOWER);
      }) as StructureTower[]
    };

    this.kernel.data.roomData[this.metaData.roomName] = roomData;

    room.memory.cache = {};

    const proc = this;
    _.forEach(this.fields, function(field)
    {
      room.memory.cache[field] = proc.deflate(roomData[field]);
    });

    _.forEach(this.mapFields, function(field)
    {
      const result = {} as { [id: string]: string[] };
      const keys = Object.keys(roomData[field]);

      _.forEach(keys, function(key)
      {
        result[key] = roomData[field][key].id;
      });

      room.memory.cache[field] = result;
    });

    _.forEach(this.singleFields, function(field)
    {
      if (roomData[field] && roomData[field].id)
      {
        room.memory.cache[field] = roomData[field].id;
      }
    });
  }

  /** Import the room data from memory */
  public importFromMemory(room: Room)
  {
    if (!room.memory.cache)
    {
      this.build(room);
      return;
    }

    const roomData: RoomData = {
      constructionSites: [],
      containers: [],
      coreLink: undefined,
      extensions: [],
      extractor: undefined,
      generalContainers: [],
      mineral: undefined,
      labs: [],
      links: [],
      ramparts: [],
      roads: [],
      spawns: [],
      sources: [],
      sourceContainers: [],
      sourceContainerMaps: {} as { [id: string]: StructureContainer },
      towers: []
    };
    let run = true;
    let i = 0;

    if (room.memory.numSites !== Object.keys(Game.constructionSites).length)
    {
      delete room.memory.cache.constructionSites;
      room.memory.numSites = Object.keys(Game.constructionSites).length;
    }

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

      i += 1;
      if (i === this.fields.length) { run = false; }
    }

    run = true;
    i = 0;
    const proc = this;
    while (run)
    {
      const field = this.mapFields[i];

      if (room.memory.cache[field])
      {
        const keys = Object.keys(room.memory.cache[field]);
        _.forEach(keys, function(key)
        {
          const structure = Game.getObjectById(room.memory.cache[field][key]);

          if (structure)
          {
            roomData[field][key] = structure;
          }
          else
          {
            run = false;
            proc.build(room);
            return;
          }
        });
      }
      else
      {
        run = false;
        this.build(room);
        return;
      }

      i += 1;
      if (i === this.mapFields.length)
      {
        run = false;
      }
    }

    run = true;
    i = 0;
    while (run)
    {
      const field = this.singleFields[i];

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
      else
      {
        run = false;
        this.build(room);
        return;
      }

      i += 1;
      if (i === this.singleFields.length)
      {
        run = false;
      }
    }

    this.kernel.data.roomData[this.metaData.roomName] = roomData;
  }

  /** Inflate the IDs in the array.
   * Returns an object, result is the resuting array and rebuild is wether the data is wrong
   */
  public inflate(ids: string[])
  {
    let rebuild = false;
    const result: Structure[] = [];

    _.forEach(ids, function(id)
    {
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

  public deflate(objects: Structure[])
  {
    const result: string[] = [];

    _.forEach(objects, function(object)
    {
      if (object && object.id)
      {
        result.push(object.id);
      }
    });

    return result;
  }

  /** Find enemies in the room */
  public enemyDetection(room: Room)
  {
    const enemies = room.find(FIND_HOSTILE_CREEPS) as Creep[];

    if (enemies.length > 0 && !this.kernel.hasProcess("td-" + this.metaData.roomName))
    {
      this.kernel.addProcess(TowerDefenseProcess, "td-" + this.metaData.roomName, 80, {
        roomName: this.metaData.roomName
      });
    }

    if (room.controller!.level === 2 && room.controller!.ticksToDowngrade < 30)
    {
      room.controller!.activateSafeMode();
    }
  }
}
