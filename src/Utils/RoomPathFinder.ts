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

    constructor(sourceRoom: string, targetRoom: string)
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

    public step()
    {
        if (this.currentRoom.name !== this.targetRoom)
        {
            const pathFinder = this;
            const roomNames = _.values(Game.map.describeExits(this.currentRoom.name)) as string[];

            _.forEach(roomNames, (roomName) =>
            {
                const distanceToTarget = Game.map.getRoomLinearDistance(roomName, pathFinder.targetRoom);
                const distanceFromStart = Game.map.getRoomLinearDistance(roomName, pathFinder.startRoom);

                if (!_.include(pathFinder.usedRooms, roomName))
                {
                    pathFinder.openRooms.push({
                        name: roomName,
                        distanceToTarget: distanceToTarget,
                        distanceFromStart: distanceFromStart,
                        score: (distanceFromStart + distanceToTarget),
                        path: [].concat(pathFinder.currentRoom.path as never[], [roomName] as never[])
                    });
                }
            });

            this.openRooms = _.sortBy(this.openRooms, "score").reverse();

            this.currentRoom = this.openRooms.pop()!;
            this.usedRooms.push(this.currentRoom.name);

            this.step();
        }
    }

    public results()
    {
        return {
            length: this.currentRoom.path.length,
            details: this.currentRoom.path
        };
    }
}
