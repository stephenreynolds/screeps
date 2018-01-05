RoomPosition.prototype.offset = function(this: RoomPosition, x: number, y: number): RoomPosition
{
    return new RoomPosition(this.x + x, this.y + y, this.roomName);
};
