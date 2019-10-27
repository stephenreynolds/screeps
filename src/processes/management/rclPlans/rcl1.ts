import { RCLPlan } from "./rclPlan";

export class RCL1 extends RCLPlan
{
    protected rcl: number = 1;

    public generate()
    {
        this.init();

        this.addSpawn();

        this.finished();
    }

    protected init(): void
    {
        this.room.memory.roomPlan.rcl[this.rcl] = {};
    }

    private addSpawn()
    {
        this.room.memory.roomPlan.rcl[this.rcl].spawn = [this.baseSpawn.pos];
    }
}
