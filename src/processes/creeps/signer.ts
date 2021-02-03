import { CreepProcess } from "./creepProcess";
import { SignProcess } from "./actions/sign";

export class SignerCreepProcess extends CreepProcess
{
    public type = "screep";

    public run(): void
    {
        const creep = this.getCreep();

        if (creep)
        {
            // Sign the controller if not signed already.
            const controller = creep.room.controller;
            if (controller && controller.my && controller.owner &&
                (!controller.sign || controller.sign.username !== controller.owner.username))
            {
                this.fork(SignProcess, "sign-" + creep.name, this.priority - 1, {
                    creep: creep.name,
                    text: this.metaData.text
                });
            }
            else
            {
                creep.suicide();
                this.completed = true;
            }
        }
    }
}
