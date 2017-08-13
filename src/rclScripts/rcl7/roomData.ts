export class RoomData {
  // Room metadata.
  public static room: Room;

  // Room objects.
  public static spawn: Spawn;
  public static structures: Structure[];
  public static extensions: Extension[];
  public static containers: Container[];
  public static upgradeContainer: Container | undefined;
  public static storage: Storage | undefined;
  public static walls: StructureWall[];
  public static ramparts: Rampart[];
  public static roads: StructureRoad[];
  public static towers: Tower[];
  public static extractor: StructureExtractor | undefined;
  public static sources: Source[];
  public static sites: ConstructionSite[];
  public static creeps: Creep[];
  public static hostileCreeps: Creep[];
  public static creepsOfRole: {};
  public static dropped: Resource[];
  public static minerals: Mineral[];

  // Other rooms.
  public static invaderCount = 0;
  public static longHarvesterCount = 0;

  /**
   * Reinitialize room object properties.
   * @static
   * @memberof RoomData
   */
  public static reset() {
    this.structures = [];
    this.extensions = [];
    this.containers = [];
    this.upgradeContainer = undefined;
    this.storage = undefined;
    this.walls = [];
    this.ramparts = [];
    this.roads = [];
    this.towers = [];
    this.extractor = undefined;
    this.sources = [];
    this.sites = [];
    this.creeps = [];
    this.hostileCreeps = [];
    this.dropped = [];
    this.minerals = [];
    this.invaderCount = 0;
    this.longHarvesterCount = 0;
  }
}
