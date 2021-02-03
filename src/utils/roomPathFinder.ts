interface RoomPathFinderEntry
{
    name: string;
    distanceToTarget: number;
    distanceFromStart: number;
    score: number;
    path: string[];
}

export class RoomPathFinder
{
    public usedRooms: string[] = [];
    public openRooms: RoomPathFinderEntry[] = [];
    public currentRoom: RoomPathFinderEntry;
    public targetRoom: string;
    public startRoom: string;

    public constructor(sourceRoom: string, targetRoom: string)
    {
        this.currentRoom = {
            name: sourceRoom,
            distanceToTarget: Game.map.getRoomLinearDistance(sourceRoom, targetRoom),
            distanceFromStart: 0,
            score: Game.map.getRoomLinearDistance(sourceRoom, targetRoom),
            path: [sourceRoom]
        };
        this.targetRoom = targetRoom;
        this.startRoom = sourceRoom;

        this.step();
    }

    public step(): void
    {
        if (this.currentRoom.name !== this.targetRoom)
        {
            const roomNames = _.values(Game.map.describeExits(this.currentRoom.name));

            _.forEach(roomNames, (roomName: string) =>
            {
                const distanceToTarget = Game.map.getRoomLinearDistance(roomName, this.targetRoom);
                const distanceFromStart = Game.map.getRoomLinearDistance(roomName, this.startRoom);

                if (!_.include(this.usedRooms, roomName))
                {
                    this.openRooms.push({
                        name: roomName,
                        distanceToTarget,
                        distanceFromStart,
                        score: (distanceFromStart + distanceToTarget),
                        path: [].concat(this.currentRoom.path as never[], [roomName] as never[])
                    });
                }
            });

            this.openRooms = _.sortBy(this.openRooms, "score").reverse();

            const currentRoom = this.openRooms.pop();
            if (!currentRoom)
            {
                return;
            }

            this.currentRoom = currentRoom;
            this.usedRooms.push(this.currentRoom.name);

            this.step();
        }
    }

    public results(): { length: number, details: string[] }
    {
        return {
            length: this.currentRoom.path.length,
            details: this.currentRoom.path
        };
    }
}
