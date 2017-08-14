export class RoomData {
  // Room metadata.
  public static room: Room;

  // Room objects.
  public static creeps: Creep[];
  public static sources: Source[];
  public static creepsOfRole: {};

  /**
   * Reinitialize room object properties.
   * @static
   * @memberof RoomData
   */
  public static reset() {
    this.creeps = [];
    this.sources = [];
  }
}
