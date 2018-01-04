import { RCLPlan } from "./RCLPlan";

export class RCL0 extends RCLPlan
{
    public generate()
    {
        this.room.memory.roomPlan.rcl[0] = {};

        this.finished(0);
    }
}
