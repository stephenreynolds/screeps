import { Process } from "../../os/process";

export class LinkProcess extends Process
{
    public type = "lp";

    public run()
    {
        const links = this.kernel.data.roomData[this.metaData.roomName].links;

        if (!Game.rooms[this.metaData.roomName] || links.length === 0)
        {
            this.completed = true;
            return;
        }

        // Find link needing energy
        const needingEnergy = _.find(links, (l) =>
        {
            const sources = this.kernel.data.roomData[this.metaData.roomName].sources;
            return l.energy < l.energyCapacity && !!l.pos.findInRange(sources, 3);
        });

        if (!needingEnergy)
        {
            return;
        }

        // Find source link
        const sourceLink = _.find(links, (l) => {
            if (l.room.terminal && l.pos.inRangeTo(l.room.terminal, 3))
            {
                return false;
            }
            else if (l.room.controller && l.pos.inRangeTo(l.room.controller, 3))
            {
                return false;
            }
            else if (l.energy === l.energyCapacity)
            {
                return true;
            }
            else if (l.energy > 0 && needingEnergy.energy === 0)
            {
                return true;
            }
        });

        if (!sourceLink)
        {
            return;
        }

        // Transfer energy between links
        sourceLink.transferEnergy(needingEnergy);
    }
}
