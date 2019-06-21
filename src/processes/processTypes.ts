import { SuspendProcess } from "processes/system/suspend";
import { InitProcess } from "processes/system/init";
import { EnergyManagementProcess } from "processes/management/energyManagement";
import { RoomDataProcess } from "processes/system/roomData";
import { HarvesterCreepProcess } from "processes/creeps/harvester";
import { CollectProcess } from "processes/creeps/actions/collect";
import { HarvestProcess } from "processes/creeps/actions/harvest";
import { MoveProcess } from "processes/creeps/actions/move";
import { BuildProcess } from "processes/creeps/actions/build";
import { DeliverProcess } from "processes/creeps/actions/deliver";
import { UpgradeProcess } from "processes/creeps/actions/upgrade";
import { MinerCreepProcess } from "processes/creeps/miner";
import { RoomLayoutManagementProcess } from "processes/management/roomLayoutManagement";
import { StructureManagementProcess } from "processes/management/structureManagement";
import { BuilderCreepProcess } from "processes/creeps/builder";
import { RepairProcess } from "processes/creeps/actions/repair";
import { BrawlerCreepProcess } from "processes/creeps/brawler";
import { TowerDefenseProcess } from "processes/buildings/towerDefense";
import { DefenseManagementProcess } from "processes/management/defenseManagement";
import { TowerRepairProcess } from "processes/buildings/towerRepair";
import { LinkProcess } from "processes/buildings/links";
import { MineralHarvesterCreepProcess } from "processes/creeps/mineralHarvester";
import { MineralHarvestProcess } from "processes/creeps/actions/mineralHarvest";
import { SpawnRemoteBuilderProcess } from "processes/empire/spawnRemoteBuilder";
import { MineralManagementProcess } from "processes/management/mineralManagement";
import { RemoteBuilderCreepProcess } from "processes/creeps/remoteBuilder";
import { EscortCreepProcess } from "processes/creeps/escort";
import { CourierCreepProcess } from "processes/creeps/courier";
import { TransporterCreepProcess } from "processes/creeps/transporter";
import { StorageManagerCreepProcess } from "processes/creeps/storageManager";
import { HoldRoomProcess } from "processes/empire/holdRoom";
import { HoldProcess } from "processes/creeps/actions/hold";
import { FlagManagementProcess } from "processes/management/flagManagement";
import { RemoteMinerCreepProcess } from "processes/creeps/remoteMiner";
import { RemoteMiningManagementProcess } from "processes/management/remoteMiningManagement";
import { RangerManagementProcess } from "processes/management/rangerManagement";
import { InvasionManagementProcess } from "processes/management/invasionManagement";
import { RangerCreepProcess } from "processes/creeps/ranger";
import { RepairerCreepProcess } from "processes/creeps/repairer";
import { ClaimProcess } from "./empire/claim";
import { UpgraderCreepProcess } from "./creeps/upgrader";

export const ProcessTypes = {
    bcreep: BuilderCreepProcess,
    brawlcreep: BrawlerCreepProcess,
    build: BuildProcess,
    collect: CollectProcess,
    ccreep: CourierCreepProcess,
    claim: ClaimProcess,
    deliver: DeliverProcess,
    dman: DefenseManagementProcess,
    ecreep: EscortCreepProcess,
    eman: EnergyManagementProcess,
    flagman: FlagManagementProcess,
    harvest: HarvestProcess,
    hcreep: HarvesterCreepProcess,
    hold: HoldProcess,
    holdroom: HoldRoomProcess,
    init: InitProcess,
    invman: InvasionManagementProcess,
    link: LinkProcess,
    mcreep: MinerCreepProcess,
    mh: MineralHarvestProcess,
    mhcreep: MineralHarvesterCreepProcess,
    minman: MineralManagementProcess,
    move: MoveProcess,
    racreep: RangerCreepProcess,
    raman: RangerManagementProcess,
    rcreep: RepairerCreepProcess,
    rbcreep: RemoteBuilderCreepProcess,
    repair: RepairProcess,
    rmcreep: RemoteMinerCreepProcess,
    rmman: RemoteMiningManagementProcess,
    roomdata: RoomDataProcess,
    roomlayout: RoomLayoutManagementProcess,
    sman: StructureManagementProcess,
    smcreep: StorageManagerCreepProcess,
    spawnRemoteBuilder: SpawnRemoteBuilderProcess,
    suspend: SuspendProcess,
    towerdefense: TowerDefenseProcess,
    towerrepair: TowerRepairProcess,
    trcreep: TransporterCreepProcess,
    ucreep: UpgraderCreepProcess,
    upgrade: UpgradeProcess
} as { [type: string]: any };
