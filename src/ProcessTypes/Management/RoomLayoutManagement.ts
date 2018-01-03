import { log } from "Lib/Logger/Log";
import { Process } from "../../OS/Process";

export class RoomLayoutManagementProcess extends Process
{
    public type = "roomLayout";

    public readonly roomPlanVersion = 71; // Update this every time generateRoomPlan() changes.
    public readonly maxSites = 10;  // Max number of sites per room.

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
        const baseSpawn = _.find(this.kernel.data.roomData[room.name].spawns, (s) =>
        {
            return s.name === "base-" + room.name || s.name === "Spawn1"; // TODO: remove Spawn1 ASAP
        })!;
        room.memory.roomPlan.rcl[1].spawn = [baseSpawn.pos];

        // RCL 2
        room.memory.roomPlan.rcl[2] = {};
        room.memory.roomPlan.rcl[2].spawn = _.clone(room.memory.roomPlan.rcl[1].spawn);
        room.memory.roomPlan.rcl[2].container = [];
        for (const source of this.kernel.data.roomData[room.name].sources)
        {
            room.memory.roomPlan.rcl[2].container.push(this.findEmptyInRange(room, source.pos, 1, baseSpawn.pos)!);
        }
        room.memory.roomPlan.rcl[2].road = [];
        for (const s of this.kernel.data.roomData[room.name].sources)
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
        room.memory.roomPlan.rcl[2].road = room.memory.roomPlan.rcl[2].road.concat([  // Base roads
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
        ]);
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
        room.memory.roomPlan.rcl[4].rampart = [];
        for (let x = -5; x <= 8; x++)
        {
            room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(baseSpawn.pos.x + x, baseSpawn.pos.y - 5, room.name));
        }
        for (let y = -5; y <= 8; y++)
        {
            room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(baseSpawn.pos.x + 8, baseSpawn.pos.y + y, room.name));
        }
        for (let x = 7; x >= -5; x--)
        {
            room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(baseSpawn.pos.x + x, baseSpawn.pos.y + 8, room.name));
        }
        for (let y = 8; y >= 4; y--)
        {
            room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(baseSpawn.pos.x - 5, baseSpawn.pos.y + y, room.name));
        }
        for (let x = -4; x <= 7; x++)
        {
            room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(baseSpawn.pos.x + x, baseSpawn.pos.y - 4, room.name));
        }
        for (let y = -4; y <= 7; y++)
        {
            room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(baseSpawn.pos.x + 7, baseSpawn.pos.y + y, room.name));
        }
        for (let x = 6; x >= -4; x--)
        {
            room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(baseSpawn.pos.x + x, baseSpawn.pos.y + 7, room.name));
        }
        for (let y = 7; y >= 3; y--)
        {
            room.memory.roomPlan.rcl[4].rampart.push(
                new RoomPosition(baseSpawn.pos.x - 4, baseSpawn.pos.y + y, room.name));
        }

        // RCL 5
        room.memory.roomPlan.rcl[5] = {};
        room.memory.roomPlan.rcl[5].spawn = _.clone(room.memory.roomPlan.rcl[4].spawn);
        room.memory.roomPlan.rcl[5].road = _.clone(room.memory.roomPlan.rcl[4].road);
        room.memory.roomPlan.rcl[5].container = _.clone(room.memory.roomPlan.rcl[4].container);
        room.memory.roomPlan.rcl[5].extension = _.clone(room.memory.roomPlan.rcl[4].extension);
        room.memory.roomPlan.rcl[5].storage = _.clone(room.memory.roomPlan.rcl[4].storage);
        room.memory.roomPlan.rcl[5].tower = _.clone(room.memory.roomPlan.rcl[4].tower);
        room.memory.roomPlan.rcl[5].rampart = _.clone(room.memory.roomPlan.rcl[4].rampart);
        const storageLinkPos = new RoomPosition(baseSpawn.pos.x + 3, baseSpawn.pos.y + 1, room.name);
        const sourceContainers = _.filter(room.memory.roomPlan.rcl[5].container, (c: RoomPosition) =>
        {
            return c.findInRange(this.kernel.data.roomData[room.name].sources, 1);
        }) as RoomPosition[];
        room.memory.roomPlan.rcl[5].link = [
            storageLinkPos,
            this.findEmptyInRange(room, baseSpawn.pos.findClosestByRange(sourceContainers), 1, baseSpawn.pos)
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
        for (let y = controller.pos.y - 1; y <= controller.pos.y + 1; y++)
        {
            for (let x = controller.pos.x - controller.pos.x; x <= controller.pos.x + 1; x++)
            {
                if (room.lookForAt(LOOK_TERRAIN, x, y).indexOf("wall") === -1)
                {
                    room.memory.roomPlan.rcl[5].rampart.push(new RoomPosition(x, y, room.name));
                }
            }
        }

        // RCL 6
        room.memory.roomPlan.rcl[6] = {};
        room.memory.roomPlan.rcl[6].spawn = _.clone(room.memory.roomPlan.rcl[5].spawn);
        room.memory.roomPlan.rcl[6].road = _.clone(room.memory.roomPlan.rcl[5].road);
        room.memory.roomPlan.rcl[6].container = _.clone(room.memory.roomPlan.rcl[5].container);
        room.memory.roomPlan.rcl[6].extension = _.clone(room.memory.roomPlan.rcl[5].extension);
        room.memory.roomPlan.rcl[6].tower = _.clone(room.memory.roomPlan.rcl[5].tower);
        room.memory.roomPlan.rcl[6].rampart = _.clone(room.memory.roomPlan.rcl[5].rampart);
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
        room.memory.roomPlan.rcl[6].extractor = this.kernel.data.roomData[room.name].mineral!.pos;

        // RCL 7
        room.memory.roomPlan.rcl[7] = {};
        room.memory.roomPlan.rcl[7].spawn = _.clone(room.memory.roomPlan.rcl[6].spawn);
        room.memory.roomPlan.rcl[7].road = _.clone(room.memory.roomPlan.rcl[6].road);
        room.memory.roomPlan.rcl[7].container = _.clone(room.memory.roomPlan.rcl[6].container);
        room.memory.roomPlan.rcl[7].extension = _.clone(room.memory.roomPlan.rcl[6].extension);
        room.memory.roomPlan.rcl[7].tower = _.clone(room.memory.roomPlan.rcl[6].tower);
        room.memory.roomPlan.rcl[7].rampart = _.clone(room.memory.roomPlan.rcl[6].rampart);
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
        room.memory.roomPlan.rcl[7].tower = room.memory.roomPlan.rcl[7].tower.concat([
            this.findEmptyInRange(room, controller.pos, 2, baseSpawn.pos)
        ]);

        // RCL 8
        room.memory.roomPlan.rcl[8] = {};
        room.memory.roomPlan.rcl[8].spawn = _.clone(room.memory.roomPlan.rcl[7].spawn);
        room.memory.roomPlan.rcl[8].road = _.clone(room.memory.roomPlan.rcl[7].road);
        room.memory.roomPlan.rcl[8].container = _.clone(room.memory.roomPlan.rcl[7].container);
        room.memory.roomPlan.rcl[8].extension = _.clone(room.memory.roomPlan.rcl[7].extension);
        room.memory.roomPlan.rcl[8].tower = _.clone(room.memory.roomPlan.rcl[7].tower);
        room.memory.roomPlan.rcl[8].rampart = _.clone(room.memory.roomPlan.rcl[7].rampart);
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
        const buildableRCL = this.getBuildableRCL(room, room.controller!.level);
        const roomPlan = room.memory.roomPlan.rcl[buildableRCL];
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
                            log.info(`Site created for ${key} at ${pos}`);
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

    private getBuildableRCL(room: Room, rcl: number): number
    {
        if (this.isPlanFinished(room, rcl - 1))
        {
            return rcl;
        }

        return this.getBuildableRCL(room, rcl - 1);
    }

    private isPlanFinished(room: Room, rcl: number): boolean
    {
        const roomPlan = room.memory.roomPlan.rcl[rcl];

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

                // Check if structure exists here.
                const structures = _.filter(pos.look(), (r) =>
                {
                    if (r.type === "structure")
                    {
                        return r.structure!.structureType === key;
                    }
                    else
                    {
                        return false;
                    }
                });

                // Create construction site if nothing is here.
                if (structures.length === 0)
                {
                    return false;
                }
            }
        }

        return true;
    }

    private findEmptyInRange(room: Room, origin: RoomPosition,
        range: number, nearestTo?: RoomPosition): RoomPosition | undefined
    {
        const empties: RoomPosition[] = [];
        for (let y = origin.y - range; y <= origin.y + range; y++)
        {
            for (let x = origin.x - range; x <= origin.x + range; x++)
            {
                if (room.lookForAt(LOOK_TERRAIN, x, y).indexOf("wall") === -1)
                {
                    const pos = new RoomPosition(x, y, room.name);

                    if (nearestTo)
                    {
                        empties.push(pos);
                    }
                    else
                    {
                        return pos;
                    }
                }
            }
        }

        if (empties.length > 0 && nearestTo)
        {
            return nearestTo.findClosestByPath(empties);
        }

        return undefined;
    }
}
