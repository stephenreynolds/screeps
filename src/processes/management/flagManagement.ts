import { Process } from "processes/process";

import { ClaimProcess } from "../empire/claim";
import { HoldRoomProcess } from "../empire/holdRoom";

import { InvasionManagementProcess } from "./invasionManagement";
import { RangerManagementProcess } from "./rangerManagement";
import { RemoteMiningManagementProcess } from "./remoteMiningManagement";

export class FlagManagementProcess extends Process
{
    public type = "flagman";

    public run()
    {
        this.completed = true;

        if (Game.time % 100 === 0)
        {
            _.forEach(Game.rooms, (room: Room) =>
            {
                if (room.controller && room.controller.my)
                {
                    const flag = Game.flags[room.name + "-NAV"];
                    if (!flag)
                    {
                        console.log(`Room ${room.name} is missing its NAV flag. Place a flag called \"${room.name}-NAV\" on its controller.`);
                    }
                }
            });
        }

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

    private claimFlag(flag: Flag)
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

    private holdFlag(flag: Flag)
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

    private remoteMiningFlag(flag: Flag)
    {
        this.scheduler.addProcessIfNotExist(
            RemoteMiningManagementProcess,
            "rmmp-" + flag.name,
            40,
            {
                flag: flag.name
            }
        );
    }

    private rangerFlag(flag: Flag)
    {
        const count = parseInt(flag.name.split(".")[1], undefined);
        this.scheduler.addProcessIfNotExist(RangerManagementProcess, flag.name + "-rangers", 70, {
            flag: flag.name,
            rangers: [],
            count: count
        });
    }

    private invasionFlag(flag: Flag)
    {
        this.scheduler.addProcessIfNotExist(InvasionManagementProcess, `${flag.name}-invasion`, 70, {
            flag: flag.name
        });
    }
}
