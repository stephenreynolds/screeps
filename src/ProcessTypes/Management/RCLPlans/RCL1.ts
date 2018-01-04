import { RCLPlan } from "./RCLPlan";

export class RCL1 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[1] = {};
        this.room.memory.roomPlan.rcl[1].spawn = [this.baseSpawn.pos];

        this.finished(1);
    }
}
