import { BuildProcess } from "./Processes/BuildProcess";
import { HarvestProcess } from "./Processes/HarvestProcess";
import { InitProcess } from "./Processes/InitProcess";
import { MineralHarvestProcess } from "./Processes/MineralHarvestProcess";
import { Process } from "./Processes/Process";
import { RepairProcess } from "./Processes/RepairProcess";
import { RoomDataProcess } from "./Processes/RoomDataProcess";
import { RoomLayoutProcess } from "./Processes/RoomLayoutProcess";
import { TowerDefenseProcess } from "./Processes/TowerDefenseProcess";
import { UpgradeProcess } from "./Processes/UpgradeProcess";

const processTypes = {
    build: BuildProcess,
    harvest: HarvestProcess,
    init: InitProcess,
    mineralHarvest: MineralHarvestProcess,
    repair: RepairProcess,
    roomData: RoomDataProcess,
    roomLayout: RoomLayoutProcess,
    towerDefense: TowerDefenseProcess,
    upgrade: UpgradeProcess
} as { [type: string]: any };

interface ProcessTable
{
    [name: string]: Process;
}

interface KernelData
{
    roomData: {
        [name: string]: RoomData
    };

    usedSpawns: string[];
}

export class Kernel
{
    public limit = Game.cpu.limit * 0.9;
    public processTable: ProcessTable = {};

    public data = {
        roomData: {},
        usedSpawns: []
    } as KernelData;

    public constructor()
    {
        if (!Memory.kuminet)
        {
            Memory.kuminet = {};
        }

        this.loadProcessTable();
        this.addProcess(InitProcess, "init", 99, {});
    }

    public deconstruct()
    {
        const serializedProcesses: SerializedProcess[] = [];
        _.forEach(this.processTable, (p) => {
            if (!p.completed)
            {
                serializedProcesses.push(p.serialize());
            }
        });

        Memory.kuminet.processTable = serializedProcesses;
    }

    public runProcess()
    {
        const process = this.getHighestProcess();

        try
        {
            process.run();
        }
        catch (e)
        {
            console.log(`Process ${process.name} failed with error ${e}.`);
        }

        process.ticked = true;
    }

    public underLimit(): boolean
    {
        return Game.cpu.getUsed() < this.limit;
    }

    public needsToRun()
    {
        return !!this.getHighestProcess();
    }

    public getProcessByName(name: string): Process
    {
        return this.processTable[name];
    }

    public addProcessIfNotExist(processClass: any, name: string, priority: number, meta: {})
    {
        if (!this.hasProcess(name))
        {
            this.addProcess(processClass, name, priority, meta);
        }
    }

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

    public hasProcess(name: string): boolean
    {
        return !!this.getProcessByName(name);
    }

    private loadProcessTable()
    {
        const kernel = this;

        _.forEach(Memory.kuminet.processTable, (p) => {
            if (processTypes[p.type])
            {
                kernel.processTable[p.name] = new processTypes[p.type](p, kernel);
            }
            else
            {
                kernel.processTable[p.name] = new Process(p, kernel);
            }
        });
    }

    private getHighestProcess(): Process
    {
        const processesToRun = _.filter(this.processTable, (p) => {
            return !p.ticked && p.suspend === false;
        });

        return _.sortBy(processesToRun, "priority").reverse()[0];
    }
}
