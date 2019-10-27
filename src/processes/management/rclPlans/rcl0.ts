import { RCLPlan } from "./rclPlan";

export class RCL0 extends RCLPlan
{
    protected rcl: number = 0;

    public generate()
    {
        this.init();

        this.finished();
    }

    protected init()
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};
    }
}
