import { Process } from "../../OS/Process";

export class RoomLayoutManagementProcess extends Process
{
  public readonly roomPlanVersion = 47;
  public readonly maxSites = 100;
  public type = "roomLayout";

  private buildPriorities = [
    "spawn",
    "container",
    "storage",
    "link",
    "extractor",
    "terminal",
    "extension",
    "tower",
    "lab",
    "powerSpawn",
    "nuker",
    "constructedWall",
    "rampart",
    "road"
  ];

  public run()
  {
    if (Game.cpu.limit < 300)
    {
      return;
    }
    const room = Game.rooms[this.metaData.roomName];

    if (room.memory.roomPlan && room.memory.roomPlan.version === this.roomPlanVersion)
    {
      this.createSites(room);
      this.completed = true;
    }
    else
    {
      this.generateRoomPlan(room);
    }
  }

  private generateRoomPlan(room: Room)
  {
    room.memory.roomPlan = {};
    room.memory.roomPlan.version = this.roomPlanVersion;
    room.memory.roomPlan.rcl = [];

    // RCL 0
    room.memory.roomPlan.rcl[0] = {};

    // RCL 1
    room.memory.roomPlan.rcl[1] = {};
    const baseSpawn = _.find(room.find(FIND_MY_SPAWNS), (s) =>
    {
      return s.name === "base-" + room.name;
    })!;
    room.memory.roomPlan.rcl[1].spawn = [baseSpawn.pos];

    // RCL 2
    room.memory.roomPlan.rcl[2] = {};
    room.memory.roomPlan.rcl[2].spawn = _.clone(room.memory.roomPlan.rcl[1].spawn);
    room.memory.roomPlan.rcl[2].road = [  // Base roads
      // Top
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y - 1, room.name),
      // Right
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y + 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y + 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y + 3, room.name),
      // Bottom
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y + 4, room.name),
      // Left
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y + 3, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y + 2, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y + 1, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y, room.name)
    ];
    const sources = room.find(FIND_SOURCES);
    for (const s of sources)
    {
      for (const pos of PathFinder.search(baseSpawn.pos, { pos: s.pos, range: 1 }).path)
      {
        room.memory.roomPlan.rcl[2].road.push(pos);
      }
    }
    const controller = room.controller!;
    for (const pos of PathFinder.search(baseSpawn.pos, { pos: controller.pos, range: 1 }).path)
    {
      room.memory.roomPlan.rcl[2].road.push(pos);
    }
    room.memory.roomPlan.rcl[2].extension = [
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y, room.name)
    ];
    room.memory.roomPlan.rcl[2].road = room.memory.roomPlan.rcl[2].road.concat([
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y + 1, room.name)
    ]);
    room.memory.roomPlan.rcl[2].container = [];
    for (const source of sources)
    {
      const empties: RoomPosition[] = [];
      for (let y = source.pos.y - 1; y < source.pos.y + 1; y++)
      {
        for (let x = source.pos.x - 1; x < source.pos.x + 1; x++)
        {
          const structures = _.filter(room.lookAt(x, y), (l) =>
          {
            return l.type === LOOK_STRUCTURES;
          });

          if (structures.length === 0)
          {
            empties.push(new RoomPosition(x, y, room.name));
          }
        }
      }
      room.memory.roomPlan.rcl[2].container.push(baseSpawn.pos.findClosestByPath(empties));
    }

    // RCL 3
    room.memory.roomPlan.rcl[3] = {};
    room.memory.roomPlan.rcl[3].spawn = _.clone(room.memory.roomPlan.rcl[2].spawn);
    room.memory.roomPlan.rcl[3].road = _.clone(room.memory.roomPlan.rcl[2].road);
    room.memory.roomPlan.rcl[3].container = _.clone(room.memory.roomPlan.rcl[2].container);
    room.memory.roomPlan.rcl[3].extension = _.clone(room.memory.roomPlan.rcl[2].extension);
    room.memory.roomPlan.rcl[3].extension = room.memory.roomPlan.rcl[3].extension.concat([
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y + 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y + 5, room.name)
    ]);
    room.memory.roomPlan.rcl[3].road = room.memory.roomPlan.rcl[3].road.concat([
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y + 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y + 5, room.name)
    ]);
    room.memory.roomPlan.rcl[3].tower = [new RoomPosition(baseSpawn.pos.x - 5, baseSpawn.pos.y - 5, room.name)];

    // RCL 4
    room.memory.roomPlan.rcl[4] = {};
    room.memory.roomPlan.rcl[4].spawn = _.clone(room.memory.roomPlan.rcl[3].spawn);
    room.memory.roomPlan.rcl[4].road = _.clone(room.memory.roomPlan.rcl[3].road);
    room.memory.roomPlan.rcl[4].container = _.clone(room.memory.roomPlan.rcl[3].container);
    room.memory.roomPlan.rcl[4].extension = _.clone(room.memory.roomPlan.rcl[3].extension);
    room.memory.roomPlan.rcl[4].tower = _.clone(room.memory.roomPlan.rcl[3].tower);
    room.memory.roomPlan.rcl[4].storage = [new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y + 1, room.name)];
    room.memory.roomPlan.rcl[4].extension = room.memory.roomPlan.rcl[4].extension.concat([
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y + 3, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y + 1, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y - 1, room.name)
    ]);
    room.memory.roomPlan.rcl[4].road = room.memory.roomPlan.rcl[4].road.concat([
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y + 2, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y, room.name)
    ]);

    // RCL 5
    room.memory.roomPlan.rcl[5] = {};
    room.memory.roomPlan.rcl[5].spawn = _.clone(room.memory.roomPlan.rcl[4].spawn);
    room.memory.roomPlan.rcl[5].road = _.clone(room.memory.roomPlan.rcl[4].road);
    room.memory.roomPlan.rcl[5].container = _.clone(room.memory.roomPlan.rcl[4].container);
    room.memory.roomPlan.rcl[5].extension = _.clone(room.memory.roomPlan.rcl[4].extension);
    room.memory.roomPlan.rcl[5].storage = _.clone(room.memory.roomPlan.rcl[4].storage);
    room.memory.roomPlan.rcl[5].tower = _.clone(room.memory.roomPlan.rcl[4].tower);
    const storageLinkPos = new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y + 1, room.name);
    const sourceContainers = _.filter(room.memory.roomPlan.rcl[5].container, (c: RoomPosition) =>
    {
      return c.findInRange(FIND_SOURCES, 1);
    }) as RoomPosition[];
    const closestContainer = baseSpawn.pos.findClosestByRange(sourceContainers);
    const ccEmpties: RoomPosition[] = [];
    for (let y = closestContainer.y - 1; y < closestContainer.y + 1; y++)
    {
      for (let x = closestContainer.x - 1; x < closestContainer.x + 1; x++)
      {
        const structures = _.filter(room.lookAt(x, y), (l) =>
        {
          return l.type === LOOK_STRUCTURES;
        });

        if (structures.length === 0)
        {
          ccEmpties.push(new RoomPosition(x, y, room.name));
        }
      }
    }
    room.memory.roomPlan.rcl[5].link = [
      storageLinkPos,
      baseSpawn.pos.findClosestByRange(ccEmpties)
    ];
    room.memory.roomPlan.rcl[5].extension = room.memory.roomPlan.rcl[5].extension.concat([
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y + 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y + 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y + 2, room.name)
    ]);
    room.memory.roomPlan.rcl[5].road = room.memory.roomPlan.rcl[5].road.concat([
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y + 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y + 3, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y + 1, room.name)
    ]);
    room.memory.roomPlan.rcl[5].tower = room.memory.roomPlan.rcl[5].tower.concat([
      new RoomPosition(baseSpawn.pos.x + 8, baseSpawn.pos.y + 8, room.name)
    ]);

    // RCL 6
    room.memory.roomPlan.rcl[6] = {};
    room.memory.roomPlan.rcl[6].spawn = _.clone(room.memory.roomPlan.rcl[5].spawn);
    room.memory.roomPlan.rcl[6].road = _.clone(room.memory.roomPlan.rcl[5].road);
    room.memory.roomPlan.rcl[6].container = _.clone(room.memory.roomPlan.rcl[5].container);
    room.memory.roomPlan.rcl[6].extension = _.clone(room.memory.roomPlan.rcl[5].extension);
    room.memory.roomPlan.rcl[6].tower = _.clone(room.memory.roomPlan.rcl[5].tower);
    room.memory.roomPlan.rcl[6].storage = _.clone(room.memory.roomPlan.rcl[5].storage);
    room.memory.roomPlan.rcl[6].link = _.clone(room.memory.roomPlan.rcl[5].link);
    room.memory.roomPlan.rcl[6].terminal = [new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y + 3, room.name)];
    room.memory.roomPlan.rcl[6].extension = room.memory.roomPlan.rcl[6].extension.concat([
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y, room.name)
    ]);
    room.memory.roomPlan.rcl[6].road = room.memory.roomPlan.rcl[6].road.concat([
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y - 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y + 1, room.name)
    ]);

    // RCL 7
    room.memory.roomPlan.rcl[7] = {};
    room.memory.roomPlan.rcl[7].spawn = _.clone(room.memory.roomPlan.rcl[6].spawn);
    room.memory.roomPlan.rcl[7].road = _.clone(room.memory.roomPlan.rcl[6].road);
    room.memory.roomPlan.rcl[7].container = _.clone(room.memory.roomPlan.rcl[6].container);
    room.memory.roomPlan.rcl[7].extension = _.clone(room.memory.roomPlan.rcl[6].extension);
    room.memory.roomPlan.rcl[7].tower = _.clone(room.memory.roomPlan.rcl[6].tower);
    room.memory.roomPlan.rcl[7].storage = _.clone(room.memory.roomPlan.rcl[6].storage);
    room.memory.roomPlan.rcl[7].link = _.clone(room.memory.roomPlan.rcl[6].link);
    room.memory.roomPlan.rcl[7].terminal = _.clone(room.memory.roomPlan.rcl[6].terminal);
    room.memory.roomPlan.rcl[7].spawn.push(new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y, room.name));
    room.memory.roomPlan.rcl[7].extension = room.memory.roomPlan.rcl[7].extension.concat([
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y + 2, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x + 6, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x - 2, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y + 5, room.name)
    ]);
    room.memory.roomPlan.rcl[7].road = room.memory.roomPlan.rcl[7].road.concat([
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y + 3, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y + 5, room.name),
      new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x + 5, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x - 3, baseSpawn.pos.y + 7, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y + 6, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y + 4, room.name)
    ]);
    const towerEmpties: RoomPosition[] = [];
    for (let y = controller.pos.y - 2; y < controller.pos.y + 2; y++)
    {
      for (let x = controller.pos.x - 2; x < controller.pos.x + 2; x++)
      {
        const structures = _.filter(room.lookAt(x, y), (l) =>
        {
          return l.type === LOOK_STRUCTURES;
        });

        if (structures.length === 0)
        {
          towerEmpties.push(new RoomPosition(x, y, room.name));
        }
      }
    }
    room.memory.roomPlan.rcl[7].tower = room.memory.roomPlan.rcl[7].tower.concat([
      baseSpawn.pos.findClosestByRange(towerEmpties)
    ]);

    // RCL 8
    room.memory.roomPlan.rcl[8] = {};
    room.memory.roomPlan.rcl[8].spawn = _.clone(room.memory.roomPlan.rcl[7].spawn);
    room.memory.roomPlan.rcl[8].road = _.clone(room.memory.roomPlan.rcl[7].road);
    room.memory.roomPlan.rcl[8].container = _.clone(room.memory.roomPlan.rcl[7].container);
    room.memory.roomPlan.rcl[8].extension = _.clone(room.memory.roomPlan.rcl[7].extension);
    room.memory.roomPlan.rcl[8].tower = _.clone(room.memory.roomPlan.rcl[7].tower);
    room.memory.roomPlan.rcl[8].storage = _.clone(room.memory.roomPlan.rcl[7].storage);
    room.memory.roomPlan.rcl[8].link = _.clone(room.memory.roomPlan.rcl[7].link);
    room.memory.roomPlan.rcl[8].terminal = _.clone(room.memory.roomPlan.rcl[7].terminal);
    room.memory.roomPlan.rcl[8].spawn.push(new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y + 1, room.name));
    room.memory.roomPlan.rcl[8].extension = room.memory.roomPlan.rcl[8].extension.concat([
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y + 3, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y + 1, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y - 3, room.name),
      new RoomPosition(baseSpawn.pos.x, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 2, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 4, baseSpawn.pos.y - 1, room.name),
      new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x + 1, baseSpawn.pos.y + 4, room.name),
      new RoomPosition(baseSpawn.pos.x - 1, baseSpawn.pos.y + 4, room.name)
    ]);
    room.memory.roomPlan.rcl[8].road = room.memory.roomPlan.rcl[8].road.concat([
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y + 2, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y - 2, room.name),
      new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y - 4, room.name)
    ]);
    const midpoint = new RoomPosition(
      Math.round((baseSpawn.pos.x + controller.pos.x) / 2),
      Math.round((baseSpawn.pos.y + controller.pos.y) / 2), room.name);
    room.memory.roomPlan.rcl[8].tower = room.memory.roomPlan.rcl[8].tower.concat([
      midpoint,
      new RoomPosition(baseSpawn.pos.x + 8, baseSpawn.pos.y - 5, room.name),
      new RoomPosition(baseSpawn.pos.x - 5, baseSpawn.pos.y + 8, room.name)
    ]);
  }

  private createSites(room: Room)
  {
    const roomPlan = room.memory.roomPlan.rcl[room.controller!.level];
    let siteCount = room.memory.numSites;

    if (siteCount < this.maxSites)
    {
      // For each building...
      for (const key of this.buildPriorities)
      {
        if (!roomPlan.hasOwnProperty(key))
        {
          continue;
        }

        // Get each position...
        for (const position in roomPlan[key])
        {
          const pos = new RoomPosition(roomPlan[key][position].x,
            roomPlan[key][position].y, room.name);

          // Check if structure or construction site already exists here.
          const structures = _.filter(pos.look(), (r) =>
          {
            if (r.type === "structure")
            {
              return r.structure!.structureType === key;
            }
            else if (r.type === "constructionSite")
            {
              return r.constructionSite!.structureType === key;
            }
            else
            {
              return false;
            }
          });

          // Create construction site if nothing is here.
          if (structures.length === 0)
          {
            if (pos.createConstructionSite(key as BuildableStructureConstant) === OK)
            {
              console.log(`Site created for ${key} at ${pos}`);
              siteCount++;
            }

            if (siteCount >= this.maxSites)
            {
              return;
            }
          }
        }
      }
    }
  }
}
