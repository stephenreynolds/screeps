import { Process } from "./Process";

// Uncategorized Processes
import { RoomDataProcess } from "../ProcessTypes/RoomData";

// Building Processes
import { LinkProcess } from "../ProcessTypes/BuildingProcesses/LinkProcess";
import { TowerDefenseProcess } from "../ProcessTypes/BuildingProcesses/TowerDefense";
import { TowerRepairProcess } from "../ProcessTypes/BuildingProcesses/TowerRepair";

// Creep Action Processes
import { BuildProcess } from "../ProcessTypes/CreepActions/Build";
import { CollectProcess } from "../ProcessTypes/CreepActions/Collect";
import { DeliverProcess } from "../ProcessTypes/CreepActions/Deliver";
import { HarvestProcess } from "../ProcessTypes/CreepActions/Harvest";
import { HoldProcess } from "../ProcessTypes/CreepActions/Hold";
import { MineralHarvestProcess } from "../ProcessTypes/CreepActions/MineralHarvest";
import { MoveProcess } from "../ProcessTypes/CreepActions/Move";
import { RepairProcess } from "../ProcessTypes/CreepActions/Repair";
import { UpgradeProcess } from "../ProcessTypes/CreepActions/Upgrade";

// Empire Action Processes
import { ClaimProcess } from "../ProcessTypes/EmpireActions/Claim";
import { HoldRoomProcess } from "../ProcessTypes/EmpireActions/HoldRoom";

// Lifetime Processes
import { BrawlerLifetimeProcess } from "../ProcessTypes/Lifetimes/Brawler";
import { BuilderLifetimeProcess } from "../ProcessTypes/Lifetimes/Builder";
import { CourierLifetimeProcess } from "../ProcessTypes/Lifetimes/Courier";
import { EscortLifetimeProcess } from "../ProcessTypes/Lifetimes/Escort";
import { HarvesterLifetimeProcess } from "../ProcessTypes/Lifetimes/Harvester";
import { MinerLifetimeProcess } from "../ProcessTypes/Lifetimes/Miner";
import { MineralharvesterLifetimeProcess } from "../ProcessTypes/Lifetimes/MineralHarvester";
import { RangerLifetimeProcess } from "../ProcessTypes/Lifetimes/Ranger";
import { RemoteBuilderLifetimeProcess } from "../ProcessTypes/Lifetimes/RemoteBuilder";
import { RemoteMinerLifetimeProcess } from "../ProcessTypes/Lifetimes/RemoteMiner";
import { RepairerLifetimeProcess } from "../ProcessTypes/Lifetimes/Repairer";
import { StorageManagerLifetime } from "../ProcessTypes/Lifetimes/StorageManager";
import { TransporterLifetimeProcess } from "../ProcessTypes/Lifetimes/Transporter";
import { UpgraderLifetimeProcess } from "../ProcessTypes/Lifetimes/Upgrader";

// Management Processes
import { DefenseManagementProcess } from "../ProcessTypes/Management/DefenseManagement";
import { EnergyManagementProcess } from "../ProcessTypes/Management/EnergyManagement";
import { InvasionManagementProcess } from "../ProcessTypes/Management/InvasionManagement";
import { MineralManagementProcess } from "../ProcessTypes/Management/MineralManagement";
import { RangerManagementProcess } from "../ProcessTypes/Management/RangerManagement";
import { RemoteMiningManagementProcess } from "../ProcessTypes/Management/RemoteMiningManagement";
import { RoomLayoutManagementProcess } from "../ProcessTypes/Management/RoomLayoutManagement";
import { StructureManagementProcess } from "../ProcessTypes/Management/StructureManagement";

// System Processes
import { InitProcess } from "../ProcessTypes/System/Init";
import { SpawnRemoteBuilderProcess } from "../ProcessTypes/System/SpawnRemoteBuilder";
import { SuspensionProcess } from "../ProcessTypes/System/Suspension";

const ProcessTypes = {
    build: BuildProcess,
    blf: BuilderLifetimeProcess,
    brawlerLifetime: BrawlerLifetimeProcess,
    claim: ClaimProcess,
    collect: CollectProcess,
    clf: CourierLifetimeProcess,
    deliver: DeliverProcess,
    dm: DefenseManagementProcess,
    elf: EscortLifetimeProcess,
    em: EnergyManagementProcess,
    harvest: HarvestProcess,
    hlf: HarvesterLifetimeProcess,
    holdRoom: HoldRoomProcess,
    hold: HoldProcess,
    inv: InvasionManagementProcess,
    lp: LinkProcess,
    mh: MineralHarvestProcess,
    mhlf: MineralharvesterLifetimeProcess,
    mlf: MinerLifetimeProcess,
    mineralManagement: MineralManagementProcess,
    move: MoveProcess,
    rangerLifetime: RangerLifetimeProcess,
    rangerManagement: RangerManagementProcess,
    rblf: RemoteBuilderLifetimeProcess,
    rmlf: RemoteMinerLifetimeProcess,
    rmmp: RemoteMiningManagementProcess,
    repair: RepairProcess,
    rlf: RepairerLifetimeProcess,
    roomData: RoomDataProcess,
    roomLayout: RoomLayoutManagementProcess,
    sm: StructureManagementProcess,
    smlf: StorageManagerLifetime,
    spawnRemoteBuilder: SpawnRemoteBuilderProcess,
    suspend: SuspensionProcess,
    td: TowerDefenseProcess,
    trlf: TransporterLifetimeProcess,
    towerRepair: TowerRepairProcess,
    upgrade: UpgradeProcess,
    ulf: UpgraderLifetimeProcess
} as { [type: string]: any };

interface KernelData
{
    roomData: {
        [name: string]: RoomData
    };
    usedSpawns: string[];
}

interface ProcessTable
{
    [name: string]: Process;
}

export class Kernel
{
    /** The CPU Limit for this tick */
    public limit = Game.cpu.limit * 0.9;
    /** The process table */
    public processTable: ProcessTable = {};
    /** IPC Messages */
    public ipc: IPCMessage[] = [];

    public ProcessTypes = ProcessTypes;

    public data = {
        roomData: {},
        usedSpawns: []
    } as KernelData;

    public execOrder: Array<{}> = [];
    public suspendCount = 0;

    /**  Creates a new kernel ensuring that memory exists and re-loads the process table from the last. */
    constructor()
    {
        if (!Memory.kumiOS)
        {
            Memory.kumiOS = {};
        }

        this.loadProcessTable();

        this.addProcess(InitProcess, "init", 99, {});
    }

    /** Check if the current cpu usage is below the limit for this tick */
    public underLimit()
    {
        if (this.limit)
        {
            return (Game.cpu.getUsed() < this.limit);
        }
        else
        {
            return (Game.cpu.getUsed() < 50);
        }
    }

    /** Is there any processes left to run */
    public needsToRun()
    {
        return (!!this.getHighestProcess());
    }

    /** Load the process table from Memory */
    public loadProcessTable()
    {
        const kernel = this;
        _.forEach(Memory.kumiOS.processTable, (entry) =>
        {
            if (ProcessTypes[entry.type])
            {
                // kernel.processTable.push(new ProcessTypes[entry.type](entry, kernel))
                kernel.processTable[entry.name] = new ProcessTypes[entry.type](entry, kernel);
            }
            else
            {
                kernel.processTable[entry.name] = new Process(entry, kernel);
            }
        });
    }

    /** Tear down the OS ready for the end of the tick */
    public teardown()
    {
        const list: SerializedProcess[] = [];
        _.forEach(this.processTable, (entry) =>
        {
            if (!entry.completed)
            {
                list.push(entry.serialize());
            }
        });

        Memory.kumiOS.processTable = list;
    }

    /** Returns the highest priority process in the process table */
    public getHighestProcess()
    {
        const toRunProcesses = _.filter(this.processTable, (entry) =>
        {
            return (!entry.ticked && entry.suspend === false);
        });

        return _.sortBy(toRunProcesses, "priority").reverse()[0];
    }

    /** Run the highest priority process in the process table */
    public runProcess()
    {
        const process = this.getHighestProcess();
        const cpuUsed = Game.cpu.getUsed();
        let faulted = false;

        try
        {
            process.run(this);
        }
        catch (e)
        {
            console.log(`Process ${process.name} failed with error ${e}`);
            faulted = true;
        }

        this.execOrder.push({
            name: process.name,
            cpu: Game.cpu.getUsed() - cpuUsed,
            type: process.type,
            faulted: faulted
        });

        process.ticked = true;
    }

    /** Add a process to the process table */
    public addProcess(processClass: any, name: string, priority: number, meta: {}, parent?: string | undefined)
    {
        const process = new processClass({
            name: name,
            priority: priority,
            metaData: meta,
            suspend: false,
            parent: parent
        }, this);

        this.processTable[name] = process;
    }

    /** Add a process to the process table if it does not exist */
    public addProcessIfNotExist(processClass: any, name: string, priority: number, meta: {})
    {
        if (!this.hasProcess(name))
        {
            this.addProcess(processClass, name, priority, meta);
        }
    }

    /** No operation */
    public noop()
    {
        // Do nothing
    }

    /** Send message to another process */
    public sendIpc(sourceProcess: string, targetProcess: string, message: object)
    {
        this.ipc.push({
            from: sourceProcess,
            to: targetProcess,
            message: message
        });
    }

    /** Get ipc messages for the given process */
    public getIpc(targetProcess: string)
    {
        return _.filter(this.ipc, (entry) =>
        {
            return (entry.to === targetProcess);
        });
    }

    /** get a process by name */
    public getProcessByName(name: string)
    {
        return this.processTable[name];
    }

    /** wait for the given process to complete and then runs cb */
    public waitForProcess(name: string, thisArg: Process, cb: () => void)
    {
        const proc = this.getProcessByName(name);

        if (!proc || proc.completed)
        {
            cb.call(thisArg);
        }
    }

    /** does the given process exist in the process table */
    public hasProcess(name: string): boolean
    {
        return (!!this.getProcessByName(name));
    }

    /** output a message to console */
    public log(proc: Process, message: any)
    {
        console.log(`{${Game.time}}[${proc.name}] ${message}`);
    }

    /** Remove the process if it exists */
    public removeProcess(name: string)
    {
        if (this.hasProcess(name))
        {
            const proc = this.getProcessByName(name);
            proc.completed = true;
            proc.ticked = true;
        }
    }

    /** Get processes by type */
    public getProcessesByType(type: string)
    {
        return _.filter(this.processTable, (process) =>
        {
            return (process.type === type);
        });
    }
}