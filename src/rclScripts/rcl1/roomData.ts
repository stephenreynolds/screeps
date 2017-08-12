export class RoomData {
  // Room metadata.
  public static room: Room;

  // Room objects.
  public static spawn: Spawn;
  public static structures: Structure[];
  public static sources: Source[];
  public static creeps: Creep[];
  public static creepsOfRole: {};

  /**
   * Reinitialize room object properties.
   * @static
   * @memberof RoomData
   */
  public static reset() {
    this.structures = [];
    this.sources = [];
    this.creeps = [];
  }
}
