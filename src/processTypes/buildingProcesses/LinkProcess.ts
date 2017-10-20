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
            return l.energy < l.energyCapacity;
        });

        if (!needingEnergy)
        {
            return;
        }

        // Find full link
        const fullLink = _.find(links, (l) => {
            return l.energy === l.energyCapacity || l.energy > 0 && needingEnergy.energy === 0;
        });

        if (!fullLink)
        {
            return;
        }

        // Transfer energy between links
        fullLink.transferEnergy(needingEnergy);
    }
}
