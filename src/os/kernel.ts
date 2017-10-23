import { Process } from "./process";

import { LinkProcess } from "../processTypes/buildingProcesses/LinkProcess";
import { TowerDefenseProcess } from "../processTypes/buildingProcesses/towerDefense";
import { TowerRepairProcess } from "../processTypes/buildingProcesses/towerRepair";
import { BuildProcess } from "../processTypes/creepActions/build";
import { CollectProcess } from "../processTypes/creepActions/collect";
import { DeliverProcess } from "../processTypes/creepActions/deliver";
import { HarvestProcess } from "../processTypes/creepActions/harvest";
import { HoldProcess } from "../processTypes/creepActions/hold";
import { MineralHarvestProcess } from "../processTypes/creepActions/mineralHarvest";
import { MoveProcess } from "../processTypes/creepActions/move";
import { RepairProcess } from "../processTypes/creepActions/repair";
import { UpgradeProcess } from "../processTypes/creepActions/upgrade";
import { ClaimProcess } from "../processTypes/empireActions/claim";
import { HoldRoomProcess } from "../processTypes/empireActions/hold";
import { BuilderLifetimeProcess } from "../processTypes/lifetimes/builder";
import { CourierLifetimeProcess } from "../processTypes/lifetimes/courier";
import { HarvesterLifetimeProcess } from "../processTypes/lifetimes/harvester";
import { MinerLifetimeProcess } from "../processTypes/lifetimes/miner";
import { MineralharvesterLifetimeProcess } from "../processTypes/lifetimes/mineralHarvester";
import { RangerLifetimeProcess } from "../processTypes/lifetimes/ranger";
import { RemoteBuilderLifetimeProcess } from "../processTypes/lifetimes/remoteBuilder";
import { RemoteMinerLifetimeProcess } from "../processTypes/lifetimes/remoteMiner";
import { RepairerLifetimeProcess } from "../processTypes/lifetimes/repairer";
import { StorageManagerLifetime } from "../processTypes/lifetimes/storageManager";
import { TransporterLifetimeProcess } from "../processTypes/lifetimes/transporter";
import { UpgraderLifetimeProcess } from "../processTypes/lifetimes/upgrader";
import { EnergyManagementProcess } from "../processTypes/management/energy";
import { MineralManagementProcess } from "../processTypes/management/mineral";
import { RangerManagementProcess } from "../processTypes/management/rangers";
import { RemoteMiningManagementProcess } from "../processTypes/management/remoteMining";
import { RoomLayoutProcess } from "../processTypes/management/roomLayout";
import { StructureManagementProcess } from "../processTypes/management/structure";
import { RoomDataProcess } from "../processTypes/roomData";
import { InitProcess } from "../processTypes/system/init";
import { SpawnRemoteBuilderProcess } from "../processTypes/system/spawnRemoteBuilder";
import { SuspensionProcess } from "../processTypes/system/suspension";

import { log } from "../lib/logger/log";

const processTypes = {
  build: BuildProcess,
  blf: BuilderLifetimeProcess,
  claim: ClaimProcess,
  collect: CollectProcess,
  clf: CourierLifetimeProcess,
  deliver: DeliverProcess,
  em: EnergyManagementProcess,
  harvest: HarvestProcess,
  hlf: HarvesterLifetimeProcess,
  holdRoom: HoldRoomProcess,
  hold: HoldProcess,
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
  roomLayout: RoomLayoutProcess,
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

  public processTypes = processTypes;

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
    return (Game.cpu.getUsed() < this.limit);
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
    _.forEach(Memory.kumiOS.processTable, function(entry)
    {
      if (processTypes[entry.type])
      {
        // kernel.processTable.push(new processTypes[entry.type](entry, kernel))
        kernel.processTable[entry.name] = new processTypes[entry.type](entry, kernel);
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
    _.forEach(this.processTable, function(entry)
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
    const toRunProcesses = _.filter(this.processTable, function(entry)
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
    } catch (e)
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
    return _.filter(this.ipc, function(entry)
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
    return _.filter(this.processTable, function(process)
    {
      return (process.type === type);
    });
  }
}
