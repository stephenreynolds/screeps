// Stats
import { Stats } from "Utils/Stats";

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
import { MineralHarvesterLifetimeProcess } from "../ProcessTypes/Lifetimes/MineralHarvester";
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
import { FlagManagementProcess } from "../ProcessTypes/Management/FlagManagement";
import { InvasionManagementProcess } from "../ProcessTypes/Management/InvasionManagement";
import { MineralManagementProcess } from "../ProcessTypes/Management/MineralManagement";
import { RangerManagementProcess } from "../ProcessTypes/Management/RangerManagement";
import { RemoteMiningManagementProcess } from "../ProcessTypes/Management/RemoteMiningManagement";
import { RoomLayoutManagementProcess } from "../ProcessTypes/Management/RoomLayoutManagement";
import { StructureManagementProcess } from "../ProcessTypes/Management/StructureManagement";

// System Processes
import { InitProcess } from "../ProcessTypes/System/Init";
import { RoomDataProcess } from "../ProcessTypes/System/RoomData";
import { SpawnRemoteBuilderProcess } from "../ProcessTypes/System/SpawnRemoteBuilder";
import { SuspensionProcess } from "../ProcessTypes/System/Suspension";

// Libs
import { log } from "../Lib/Logger/Log";

// Abstract process
import { Process } from "./Process";

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
    flag: FlagManagementProcess,
    harvest: HarvestProcess,
    hlf: HarvesterLifetimeProcess,
    holdRoom: HoldRoomProcess,
    hold: HoldProcess,
    inv: InvasionManagementProcess,
    lp: LinkProcess,
    mh: MineralHarvestProcess,
    mhlf: MineralHarvesterLifetimeProcess,
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
    public limit: number;
    /** The process table */
    public processTable: ProcessTable = {};
    /** IPC Messages */
    public ipc: IPCMessage[] = [];

    public ProcessTypes = ProcessTypes;

    public toRunProcesses?: string[];

    public data = {
        roomData: {},
        usedSpawns: []
    } as KernelData;

    public execOrder: Array<{}> = [];
    public suspendCount = 0;
    public schedulerUsage = 0;

    /**  Creates a new kernel ensuring that memory exists and re-loads the process table from the last. */
    constructor()
    {
        if (!Memory.kumiOS)
        {
            Memory.kumiOS = {};
        }

        this.setCPULimit();

        this.loadProcessTable();

        this.addProcess(InitProcess, "init", 99, {});
    }

    private sigmoid(x: number)
    {
        return 1.0 / (1.0 + Math.exp(-x));
    }

    private sigmoidSkewed(x: number)
    {
        return this.sigmoid((x * 12.0) - 6.0);
    }

    public setCPULimit()
    {
        const bucketCeiling = 9500;
        const bucketFloor = 2000;
        const cpuMin = 0.6;

        if (Game.cpu.limit === undefined)
        {
            // We are in the simulator
            this.limit = 1000;
            return;
        }

        if (Game.cpu.bucket > bucketCeiling)
        {
            this.limit = Game.cpu.tickLimit - 10;
        } else if (Game.cpu.bucket < 1000)
        {
            this.limit = Game.cpu.limit * 0.4;
        } else if (Game.cpu.bucket < bucketFloor)
        {
            this.limit = Game.cpu.limit * cpuMin;
        } else
        {
            const bucketRange = bucketCeiling - bucketFloor;
            const depthInRange = (Game.cpu.bucket - bucketFloor) / bucketRange;
            const minAssignable = Game.cpu.limit * cpuMin;
            const maxAssignable = Game.cpu.tickLimit - 15;
            this.limit = Math.round(minAssignable + this.sigmoidSkewed(depthInRange) * (maxAssignable - minAssignable));
        }
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
        if (this.toRunProcesses && this.toRunProcesses.length > 0)
        {
            return true;
        }
        else
        {
            return _.filter(this.processTable, (process: Process) =>
            {
                return !process.ticked && process.suspend === false;
            }).length > 0;
        }
    }

    /** Load the process table from Memory */
    public loadProcessTable()
    {
        const kernel = this;
        _.forEach(Memory.kumiOS.processTable, (entry: any) =>
        {
            if (ProcessTypes[entry.type])
            {
                kernel.processTable[entry.name] = new ProcessTypes[entry.type](entry, kernel);
            }
            else
            {
                kernel.processTable[entry.name] = new Process(entry, kernel);
            }
        });
    }

    /** Tear down the OS ready for the end of the tick */
    public teardown(stats = true)
    {
        const list: SerializedProcess[] = [];
        _.forEach(this.processTable, (entry: Process) =>
        {
            if (!entry.completed)
            {
                list.push(entry.serialize());
            }
        });

        if (stats)
        {
            Stats.build(this);
        }

        Memory.kumiOS.processTable = list;
    }

    /** Returns the highest priority process in the process table */
    public getHighestProcess()
    {
        const cpu = Game.cpu.getUsed();

        if (!this.toRunProcesses || this.toRunProcesses.length === 0)
        {
            const toRunProcesses = _.filter(this.processTable, (entry: Process) =>
            {
                return (!entry.ticked && entry.suspend === false);
            });

            const sorted = _.sortBy(toRunProcesses, "priority").reverse();
            this.toRunProcesses = _.map(sorted, "name");
        }

        const name = this.toRunProcesses!.shift()!;

        this.schedulerUsage += Game.cpu.getUsed() - cpu;

        return this.processTable[name!];
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
            log.error(`Process ${process.name} failed with error ${e}`);
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
        this.toRunProcesses = [];
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
        return _.filter(this.ipc, (entry: any) =>
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
        log.info(`{${Game.time}}[${proc.name}] ${message}`);
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
        return _.filter(this.processTable, (process: Process) =>
        {
            return (process.type === type);
        });
    }
}
