import { RCLPlan } from "./rclPlan";

export class RCL1 extends RCLPlan
{
    protected rcl = 1;

    public generate(): void
    {
        this.init();

        this.addSpawn();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};
    }

    private addSpawn(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl].spawn = [this.baseSpawn.pos];
    }
}
