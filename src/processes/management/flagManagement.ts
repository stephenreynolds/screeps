import { ClaimProcess } from "../empire/claim";
import { HoldRoomProcess } from "../empire/holdRoom";
import { InvasionManagementProcess } from "./invasionManagement";
import { Process } from "processes/process";
import { RangerManagementProcess } from "./rangerManagement";
import { RemoteMiningManagementProcess } from "./remoteMiningManagement";

export class FlagManagementProcess extends Process
{
    public type = "flagman";

    public run(): void
    {
        this.completed = true;

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
    }

    private claimFlag(flag: Flag): void
    {
        this.scheduler.addProcessIfNotExist(
            ClaimProcess,
            "claim-" + flag.name,
            20,
            {
                targetRoom: flag.pos.roomName,
                flagName: flag.name
            }
        );
    }

    private holdFlag(flag: Flag): void
    {
        this.scheduler.addProcessIfNotExist(
            HoldRoomProcess,
            "hold-" + flag.name,
            20,
            {
                flag: flag.name
            }
        );
    }

    private remoteMiningFlag(flag: Flag): void
    {
        this.scheduler.addProcessIfNotExist(
            RemoteMiningManagementProcess,
            "rmman-" + flag.name,
            40,
            {
                flag: flag.name
            }
        );
    }

    private rangerFlag(flag: Flag): void
    {
        const count = parseInt(flag.name.split(".")[1], 10);
        this.scheduler.addProcessIfNotExist(RangerManagementProcess, flag.name + "-rangers", 70, {
            flag: flag.name,
            rangers: [],
            count
        });
    }

    private invasionFlag(flag: Flag): void
    {
        this.scheduler.addProcessIfNotExist(InvasionManagementProcess, `${flag.name}-invasion`, 70, {
            flag: flag.name
        });
    }
}
