<<<<<<< HEAD
=======
declare namespace NodeJS
{
    interface Global
    {
        SCRIPT_VERSION: number,
        lastTick: number,
        LastMemory: Memory,
        Memory: Memory,
        roomData: {
            [key: string]: RoomData
        }
    }
}

interface SerializedProcess
{
    name: string,
    priority: number,
    metaData: object,
    suspend: string | number | boolean,
    parent: string | undefined,
    type: string
}

interface RoomData
{
    [name: string]: any,
    constructionSites: ConstructionSite[],
    containers: StructureContainer[],
    extensions: StructureExtension[],
    extractor: StructureExtractor | undefined,
    generalContainers: StructureContainer[],
    mineral: Mineral | undefined,
    labs: StructureLab[],
    ramparts: StructureRampart[],
    roads: StructureRoad[],
    spawns: StructureSpawn[],
    sources: Source[],
    sourceContainers: StructureContainer[],
    towers: StructureTower[],
    walls: StructureWall[]
}

declare module "*.json"
{
    const value: any;
    export default value;
}

declare const __REVISION__: string;
>>>>>>> b580620c2f9df7f70cad82845eddc2c756e37314
