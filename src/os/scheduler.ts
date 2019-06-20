import { Process } from "./process";
import { ProcessTypes } from "./processTypes";
import { InitProcess } from "processes/system/init";
import { Stats } from "utils/stats";

interface SchedulerData
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

export class Scheduler
{
    public execOrder: Array<{}> = [];
    public limit: number;
    public processTable: ProcessTable = {};
    public toRunProcesses?: string[];
    public schedulerUsage: number = 0;
    public suspendCount: number = 0;

    public data = {
        roomData: {},
        usedSpawns: []
    } as SchedulerData;

    constructor()
    {
        if (!Memory.os)
        {
            Memory.os = {};
        }

        this.limit = this.calculateCPULimit();

        this.loadProcessTable();

        this.addProcess(InitProcess, "init", 99);
    }

    public addProcess(processClass: any, name: string, priority: number, meta = {}, parent?: string | undefined)
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

    public addProcessIfNotExist(processClass: any, name: string, priority: number, meta = {})
    {
        if (!this.hasProcess(name))
        {
            this.addProcess(processClass, name, priority, meta);
        }
    }

    public getProcessByName(name: string): Process
    {
        return this.processTable[name];
    }

    public getProcessesByType(type: string): Process[]
    {
        return _.filter(this.processTable, (process: Process) =>
        {
            return process.type === type;
        });
    }

    public hasProcess(name: string): boolean
    {
        return !!this.getProcessByName(name);
    }

    public log(process: Process, message: any)
    {
        console.log(`{${Game.time}}[${process.name}] ${message}`);
    }

    public run(stats = true)
    {
        while (this.underLimit() && this.needsToRun())
        {
            const process = this.getHighestProcess();
            const cpuUsed = Game.cpu.getUsed();
            let faulted = false;

            try
            {
                process.run();
            }
            catch (ex)
            {
                console.log(`Process ${process.name} failed with error ${ex}`);
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

        this.save(stats);
    }

    private calculateCPULimit(): number
    {
        const bucketCeiling = 9500;
        const bucketFloor = 2000;
        const cpuMin = 0.6;

        if (Game.cpu.limit === undefined)
        {
            // Running in the simulator.
            return 1000;
        }

        if (Game.cpu.bucket > bucketCeiling)
        {
            return Game.cpu.tickLimit - 10;
        }
        else if (Game.cpu.bucket < 1000)
        {
            return Game.cpu.limit * 0.4;
        }
        else if (Game.cpu.bucket < bucketFloor)
        {
            return Game.cpu.limit * cpuMin;
        }
        else
        {
            const bucketRange = bucketCeiling - bucketFloor;
            const depthInRange = (Game.cpu.bucket - bucketFloor) / bucketRange;
            const minAssignable = Game.cpu.limit * cpuMin;
            const maxAssignable = Game.cpu.tickLimit - 15;
            return Math.round(minAssignable + this.sigmoidSkewed(depthInRange) * (maxAssignable - minAssignable));
        }
    }

    private getHighestProcess(): Process
    {
        const cpu = Game.cpu.getUsed();

        if (!this.toRunProcesses || this.toRunProcesses.length === 0)
        {
            const toRunProcesses = _.filter(this.processTable, (process: Process) =>
            {
                return !process.ticked && process.suspend === false;
            });

            const sorted = _.sortBy(toRunProcesses, "priority").reverse();
            this.toRunProcesses = _.map(sorted, "name");
        }

        const name = this.toRunProcesses!.shift();

        this.schedulerUsage += Game.cpu.getUsed() - cpu;

        return this.processTable[name!];
    }

    private loadProcessTable()
    {
        _.forEach(Memory.os.processTable, (process: any) =>
        {
            this.processTable[process.name] = new ProcessTypes[process.type](process, this);
        });
    }

    private needsToRun(): boolean
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

    private save(stats = true)
    {
        // Save processes still running to memory.
        const list: SerializedProcess[] = [];
        _.forEach(this.processTable, (process: Process) =>
        {
            if (!process.completed)
            {
                list.push(process.serialize());
            }
        });
        Memory.os.processTable = list;

        // Build stats.
        if (stats)
        {
            Stats.build(this);
        }
    }

    private sigmoid(x: number): number
    {
        return 1.0 / (1.0 + Math.exp(-x));
    }

    private sigmoidSkewed(x: number): number
    {
        return this.sigmoid(x * 12.0 - 6.0);
    }

    private underLimit(): boolean
    {
        if (this.limit)
        {
            return Game.cpu.getUsed() < this.limit;
        }
        else
        {
            return Game.cpu.getUsed() < 50;
        }
    }
}
