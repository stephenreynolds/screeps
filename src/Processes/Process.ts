import {Kernel} from "Kernel";

export class Process
{
    public priority: number;
    public name: string;
    public ticked: boolean;
    public suspend: string | number | boolean = false;
    public completed: boolean;
    public parent: Process | undefined;
    public type: string;
    public metaData: any;
    public kernel: Kernel;

    public constructor(entry: SerializedProcess, kernel: Kernel)
    {
        this.priority = entry.priority;
        this.name = entry.name;
        this.suspend = entry.suspend;
        this.metaData = entry.metaData;
        this.kernel = kernel;

        if (entry.parent)
        {
            this.parent = this.kernel.getProcessByName(entry.parent);
        }
    }

    public run()
    {
        this.completed = true;
    }

    public serialize(): SerializedProcess
    {
        let parent;

        if (this.parent)
        {
            parent = this.parent.name;
        }

        return {
            priority: this.priority,
            name: this.name,
            metaData: this.metaData,
            type: this.type,
            suspend: this.suspend,
            parent: this.parent
        } as SerializedProcess;
    }
}
