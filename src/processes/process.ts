import { Scheduler } from "../scheduler";

export abstract class Process {
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
  /** Process type, used to re-inflate on the next tick */
  public type: string;
  /** The scheduler that started this process. */
  public scheduler: Scheduler;
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
  constructor(entry: SerializedProcess, scheduler: Scheduler) {
    this.priority = entry.priority;
    this.name = entry.name;
    this.metaData = entry.metaData;
    this.scheduler = scheduler;
    this.suspend = entry.suspend;
    this.type = entry.type;

    if (entry.parent) {
      this.parent = this.scheduler.getProcessByName(entry.parent);
    }
  }

  public abstract run(): void;

  /** Serialize this process */
  public serialize() {
    let parent;
    if (this.parent) {
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

  /** Create a new process on the scheduler with this process as its parent and
   * suspend the current process until it completes
   */
  public fork(processType: any, name: string, priority: number, meta: any) {
    this.scheduler.addProcess(processType, name, priority, meta, this.name);

    this.suspend = name;
  }

  /** Send the process a message */
  public sendMessage(name: string, data: any) {
    this.messages[name] = data;
  }

  /** Resume the process */
  public resume(thisTick = false) {
    this.suspend = false;

    if (thisTick) {
      this.ticked = false;
    }
  }

  /** Resume the parent if the process has a parent */
  public resumeParent(thisTick = false) {
    if (this.parent) {
      this.parent.resume(thisTick);
    }
  }

  /** Returns the room Data */
  public roomData() {
    return this.scheduler.data.roomData[this.metaData.roomName];
  }

  /** Returns the room instance */
  public room() {
    return Game.rooms[this.metaData.roomName];
  }

  /** Returns the flag for this process */
  public flag() {
    return Game.flags[this.metaData.flag];
  }

  /** Use the Schedulers Logger */
  public log(message: string) {
    this.scheduler.log(this, message);
  }
}
