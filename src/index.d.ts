interface RoomData
{
    [name: string]: any
    constructionSites: ConstructionSite[]
    containers: StructureContainer[]
    extensions: StructureExtension[]
    extractor: StructureExtractor | undefined
    mineral: Mineral | undefined
    labs: StructureLab[]
    links: StructureLink[]
    nuker: StructureNuker | undefined
    powerSpawn: StructurePowerSpawn | undefined
    ramparts: StructureRampart[]
    roads: StructureRoad[]
    spawns: StructureSpawn[]
    sources: Source[]
    terminal: StructureTerminal | undefined
    towers: StructureTower[]
}
