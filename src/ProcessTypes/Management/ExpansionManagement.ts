import { Process } from "OS/Process";

export class ExpansionManagementProcess extends Process
{
    public type = "exp";

    public run()
    {
        // Things this does
        // - Manages remote mining of energy and minerals
        // - Decides which rooms should be reserved
        // - Decides which rooms should be claimed
        // - Launches invasions against rooms that are worth it

        // Rooms that should be reserved:
        // - Has a mineral that is needed more
        // - Has at least two sources but not enough space for base
        // - Has at least one source that is close by path
        // - Rooms that should be claimed but GCL is too low
        // - Is adjacent to enemy room and could be claimed by enemy

        // Rooms that should be claimed:
        // - Has a mineral that is needed more
        // - Has space for base
        // - More sources is better
        // - Less swamp is better

        // Rooms that should not be reserved or claimed:
        // - Rooms that cannot be reserved or claimed
        // - Rooms that are in respawn or novice areas

        // Rooms that should not be mined:
        // - Has keeper lair and it's not worth attacking
        // - Sources are too far away by path
        // - Requires moving through enemy room to get to it

        // this.checkRooms();
        // this.decideNext();

        this.suspend = 10;
    }

    // private checkRooms()
    // {
    //     const nearby = this.getNearby();
    //     const available = this.getAvailable(nearby);
    // }

    // private checkRooms()
    // {
    //     const nearbyRooms = this.getNearby();
    //     const available = this.getAvailable(nearbyRooms);
    //     // const occupied = _.difference(nearbyRooms, available);

    //     // Second, of above rooms decide candidates for claiming
    //     const claim: Room[] = available;
    //     for (const room of claim)
    //     {
    //         // Check that base can be built
    //         type PositionWeightTuple = [RoomPosition, number];
    //         const empties: PositionWeightTuple[] = [];
    //         for (let y = 6; y <= 39; y++)
    //         {
    //             for (let x = 8; x <= 41; x++)
    //             {
    //                 let weight = 0;
    //                 let empty = true;

    //                 for (let by = y - 4; by <= y + 8; by++)
    //                 {
    //                     for (let bx = x - 6; bx <= x + 6; bx++)
    //                     {
    //                         switch (Game.map.getTerrainAt(bx, by, room.name))
    //                         {
    //                             case "plain":
    //                                 continue;
    //                             case "swamp":
    //                                 weight++;
    //                                 continue;
    //                             case "wall":
    //                                 empty = false;
    //                                 break;
    //                         }

    //                         if (!empty)
    //                         {
    //                             break;
    //                         }
    //                     }

    //                     if (!empty)
    //                     {
    //                         break;
    //                     }
    //                 }

    //                 if (empty)
    //                 {
    //                     const tuple: PositionWeightTuple = [new RoomPosition(x, y, room.name), weight];
    //                     empties.push(tuple);
    //                 }
    //             }
    //         }

    //         // Do not claim if there are no spaces big enough for base.
    //         if (empties.length === 0)
    //         {
    //             _.remove(claim, room);
    //         }
    //         else
    //         {
    //             // Get center-most position
    //             let basePosition: PositionWeightTuple = empties[0];
    //             for (const pos of empties)
    //             {
    //                 if (pos[1] < basePosition[1])
    //                 {
    //                     basePosition = pos;
    //                 }
    //             }

    //             // Place flag at base position.
    //             room.createFlag(basePosition[0], `claim-candidate-${room.name}`, COLOR_PURPLE, COLOR_GREY);
    //         }
    //     }

    //     // Third, of rooms that don't make good claiming candidates, decide
    //     // which would be good for remote mining
    //     // const mine: Room[] = _.difference(nearbyRooms, claim);

    //     // Fourth, of rooms that don't make good mining or claiming candidates,
    //     // decide which should be reserved for strategic purposes
    //     // const reserve: Room[] = mine;

    //     // Fifth, of rooms that are owned by enemy, decide which could be worth
    //     // invading
    //     // const invade: Room[] = [];
    // }

    // private getNearby()
    // {
    //     // Get rooms adjacent to this room and adjacent to those.
    //     let adjacentRooms = Object.values(Game.map.describeExits(this.metaData.roomName)) as string[];

    //     for (const name of adjacentRooms)
    //     {
    //         adjacentRooms = adjacentRooms.concat(Object.values(Game.map.describeExits(name)) as string[]);
    //     }

    //     return adjacentRooms as string[];
    // }

    // private getAvailable(roomNames: string[])
    // {
    //     const available: string[] = [];

    //     for (const name of roomNames)
    //     {
    //         const room = Game.rooms[name];

    //         if (room.controller && room.controller.level === 0)
    //         {
    //             available.push(name);
    //         }
    //     }

    //     return available;
    // }

    // private decideNext()
    // {
    //     // From the list of candidates, decide what is most important and place flag
    // }
}
