import { Kernel } from "./Kernel";

export class Process
{
  /** Has the process been run this tick? */
  public ticked = false;
  /** Is the process complete? If it is it will not be passed to the next tick */
  public completed = false;
  /** The processes priority. The higher the priority the more likely it will be run this tick. */
  public priority: number;
  /** The name of the process. Should be unique */
  public name: string;
  /** An object of meta data. Should be serializeable into JSON */
  public metaData: any;
  /** Process type, used to re-infalte on the next tick */
  public type: string;
  /** The kernel that started this process. */
  public kernel: Kernel;
  /**
   * Should the process be suspended?
   * If `false` the process will be run.
   * If a number the suspend counter will be reduced until it reaches 0 and then will be set back to false.
   * If a string this process is suspended untill the named process is finished.
   */
  public suspend: string | number | boolean = false;
  /** The Processes Parent Process */
  public parent: Process | undefined;
  /** Messages */
  public messages: { [name: string]: any } = {};

  /** Creates a new Process from the entry supplied */
  constructor(entry: SerializedProcess, kernel: Kernel)
  {
    this.priority = entry.priority;
    this.name = entry.name;
    this.metaData = entry.metaData;
    this.kernel = kernel;
    this.suspend = entry.suspend;

    if (entry.parent)
    {
      this.parent = this.kernel.getProcessByName(entry.parent);
    }
  }

  /** Run the process */
  public run(kernel: Kernel)
  {
    console.log("Process " + this.name + " did not have a type.");
    this.completed = true;
    kernel.noop();
  }

  /** Serialize this process */
  public serialize()
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
      parent: parent
    } as SerializedProcess;
  }

  /** Create a new process on the kernel with this process as its parent and
   * suspend the current process until it completes
   */
  public fork(processType: any, name: string, priority: number, meta: any)
  {
    this.kernel.addProcess(processType, name, priority, meta, this.name);

    this.suspend = name;
  }

  /** Send the process a message */
  public sendMessage(name: string, data: any)
  {
    this.messages[name] = data;
  }

  /** Resume the process */
  public resume(thisTick = false)
  {
    this.suspend = false;

    if (thisTick) { this.ticked = false; }
  }

  /** Resume the parent if the process has a parent */
  public resumeParent(thisTick = false)
  {
    if (this.parent)
    {
      this.parent.resume(thisTick);
    }
  }

  /** Returns the room Data */
  public roomData()
  {
    return this.kernel.data.roomData[this.metaData.roomName];
  }

  /** Returns the room instance */
  public room()
  {
    return Game.rooms[this.metaData.roomName];
  }

  /** Returns the flag for this process */
  public flag()
  {
    return Game.flags[this.metaData.flag];
  }

  /** Use the Kernels Logger */
  public log(message: string)
  {
    this.kernel.log(this, message);
  }
}
