import { Process } from "OS/Process";

import { ClaimProcess } from "../EmpireActions/Claim";
import { HoldRoomProcess } from "../EmpireActions/HoldRoom";

import { InvasionManagementProcess } from "./InvasionManagement";
import { RangerManagementProcess } from "./RangerManagement";
import { RemoteMiningManagementProcess } from "./RemoteMiningManagement";

export class FlagManagementProcess extends Process
{
    public type = "flagWatcher";

    public claimFlag(flag: Flag)
    {
        this.kernel.addProcessIfNotExist(
            ClaimProcess,
            "claim-" + flag.name,
            20,
            {
                targetRoom: flag.pos.roomName,
                flagName: flag.name
            }
        );
    }

    public holdFlag(flag: Flag)
    {
        this.kernel.addProcessIfNotExist(
            HoldRoomProcess,
            "hold-" + flag.name,
            20,
            {
                flag: flag.name
            }
        );
    }

    public remoteMiningFlag(flag: Flag)
    {
        this.kernel.addProcessIfNotExist(
            RemoteMiningManagementProcess,
            "rmmp-" + flag.name,
            40,
            {
                flag: flag.name
            }
        );
    }

    public rangerFlag(flag: Flag)
    {
        const count = parseInt(flag.name.split(".")[1], undefined);
        this.kernel.addProcessIfNotExist(RangerManagementProcess, flag.name + "-rangers", 70, {
            flag: flag.name,
            rangers: [],
            count: count
        });
    }

    public invasionFlag(flag: Flag)
    {
        this.kernel.addProcessIfNotExist(InvasionManagementProcess, `${flag.name}-invasion`, 70, {
            flag: flag.name
        });
    }

    public run()
    {
        _.forEach(Game.flags, (flag: Flag) =>
        {
            switch (flag.color)
            {
                case COLOR_PURPLE:
                    switch (flag.secondaryColor)
                    {
                        case COLOR_PURPLE:
                            this.holdFlag(flag);
                            break;
                        case COLOR_RED:
                            this.claimFlag(flag);
                            break;
                    }
                    break;
                case COLOR_YELLOW:
                    this.remoteMiningFlag(flag);
                    break;
                case COLOR_BLUE:
                    this.rangerFlag(flag);
                    break;
                case COLOR_RED:
                    this.invasionFlag(flag);
                    break;
            }
        });

        this.completed = true;
    }
}
