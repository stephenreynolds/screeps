export class RoomData {
  // Room metadata.
  public static room: Room;

  // Room objects.
  public static spawns: Spawn[];
  public static structures: Structure[];
  public static extensions: Extension[];
  public static containers: Container[];
  public static storage: Storage | undefined;
  public static walls: StructureWall[];
  public static ramparts: Rampart[];
  public static roads: StructureRoad[];
  public static towers: Tower[];
  public static sources: Source[];
  public static sites: ConstructionSite[];
  public static creeps: Creep[];
  public static hostileCreeps: Creep[];
  public static creepsOfRole: {};
  public static dropped: Resource[];
  public static storageFromLink: Link | undefined;
  public static storageToLink: Link | undefined;

  // Other rooms.
  public static invaderCount = 0;
  public static longHarvesterCount = 0;

  /**
   * Reinitialize room object properties.
   * @static
   * @memberof RoomData
   */
  public static reset() {
    this.spawns = [];
    this.structures = [];
    this.extensions = [];
    this.containers = [];
    this.storage = undefined;
    this.walls = [];
    this.ramparts = [];
    this.roads = [];
    this.towers = [];
    this.sources = [];
    this.sites = [];
    this.creeps = [];
    this.hostileCreeps = [];
    this.dropped = [];
    this.storageFromLink = undefined;
    this.storageToLink = undefined;
    this.invaderCount = 0;
    this.longHarvesterCount = 0;
  }
}
