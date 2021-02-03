import { BrawlerCreepProcess } from "processes/creeps/brawler";
import { BuildProcess } from "processes/creeps/actions/build";
import { BuilderCreepProcess } from "processes/creeps/builder";
import { ClaimProcess } from "./empire/claim";
import { CollectProcess } from "processes/creeps/actions/collect";
import { CourierCreepProcess } from "processes/creeps/courier";
import { DefenseManagementProcess } from "processes/management/defenseManagement";
import { DeliverProcess } from "processes/creeps/actions/deliver";
import { EnergyManagementProcess } from "processes/management/energyManagement";
import { EscortCreepProcess } from "processes/creeps/escort";
import { FlagManagementProcess } from "processes/management/flagManagement";
import { HarvestProcess } from "processes/creeps/actions/harvest";
import { HarvesterCreepProcess } from "processes/creeps/harvester";
import { HoldProcess } from "processes/creeps/actions/hold";
import { HoldRoomProcess } from "processes/empire/holdRoom";
import { InitProcess } from "processes/system/init";
import { InvasionManagementProcess } from "processes/management/invasionManagement";
import { LinkProcess } from "processes/buildings/links";
import { MinerCreepProcess } from "processes/creeps/miner";
import { MineralHarvestProcess } from "processes/creeps/actions/mineralHarvest";
import { MineralHarvesterCreepProcess } from "processes/creeps/mineralHarvester";
import { MineralManagementProcess } from "processes/management/mineralManagement";
import { MoveProcess } from "processes/creeps/actions/move";
import { RangerCreepProcess } from "processes/creeps/ranger";
import { RangerManagementProcess } from "processes/management/rangerManagement";
import { RemoteBuilderCreepProcess } from "processes/creeps/remoteBuilder";
import { RemoteMinerCreepProcess } from "processes/creeps/remoteMiner";
import { RemoteMiningManagementProcess } from "processes/management/remoteMiningManagement";
import { RepairProcess } from "processes/creeps/actions/repair";
import { RepairerCreepProcess } from "processes/creeps/repairer";
import { RoomDataProcess } from "processes/system/roomData";
import { RoomLayoutManagementProcess } from "processes/management/roomLayoutManagement";
import { SignProcess } from "./creeps/actions/sign";
import { SignerCreepProcess } from "./creeps/signer";
import { SpawnRemoteBuilderProcess } from "processes/empire/spawnRemoteBuilder";
import { StorageManagerCreepProcess } from "processes/creeps/storageManager";
import { StructureManagementProcess } from "processes/management/structureManagement";
import { SuspendProcess } from "processes/system/suspend";
import { TowerDefenseProcess } from "processes/buildings/towerDefense";
import { TowerRepairProcess } from "processes/buildings/towerRepair";
import { TransporterCreepProcess } from "processes/creeps/transporter";
import { UpgradeProcess } from "processes/creeps/actions/upgrade";
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
    screep: SignerCreepProcess,
    sign: SignProcess,
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
