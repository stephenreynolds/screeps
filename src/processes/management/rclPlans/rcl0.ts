import { RCLPlan } from "./rclPlan";

export class RCL0 extends RCLPlan
{
    protected rcl = 0;

    public generate(): void
    {
        this.init();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};
    }
}
