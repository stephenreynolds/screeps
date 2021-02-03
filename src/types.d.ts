/* eslint-disable no-underscore-dangle */
declare const __REVISION__: string;
declare const __BRANCH__: string;
declare const __DATE__: string;
declare const __MESSAGE__: string;
declare const __SCRIPT_BRANCH__: string;

declare namespace NodeJS
{
    interface Global
    {
        cc: any;
        lastTick: number
        lastMemory: Memory
        Memory: Memory
        roomData: { [key: string]: RoomData }
    }
}

interface CreepMemory
{
    [name: string]: any
}

interface FlagMemory
{
    [name: string]: any
}

interface SpawnMemory
{
    [name: string]: any
}

interface RoomMemory
{
    [name: string]: any
}

interface RawMemory
{
    _parsed: Memory;
}

interface Memory
{
    os: any;
    stats: any;
    remoteRoomStatus: any;
    visualColor: any;
}

interface SerializedProcess
{
    name: string
    priority: number
    // TODO: Try to fix the below rule
    // eslint-disable-next-line @typescript-eslint/ban-types
    metaData: object
    suspend: string | number | boolean
    parent: string | undefined
    type: string;
}

interface RoomData
{
    [name: string]: any
    constructionSites: ConstructionSite[]
    containers: StructureContainer[]
    extensions: StructureExtension[]
    extractor: StructureExtractor | undefined
    generalContainers: StructureContainer[]
    mineral: Mineral | undefined
    labs: StructureLab[]
    links: StructureLink[]
    myStructures: Structure[]
    ramparts: StructureRampart[]
    roads: StructureRoad[]
    spawns: StructureSpawn[]
    sources: Source[]
    sourceContainers: StructureContainer[]
    sourceContainerMaps: { [id: string]: StructureContainer }
    towers: StructureTower[]
    walls: StructureWall[]
}

interface DeliveryTarget extends Structure
{
    energy: number
    energyCapacity: number
    store: { [resource: string]: number }
    storeCapacity: number
}

interface CreepMetaData
{
    creep: string
}
