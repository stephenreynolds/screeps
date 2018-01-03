import { LifetimeProcess } from "../../OS/LifetimeProcess";

export class EscortLifetimeProcess extends LifetimeProcess
{
    public type = "elf";

    public run()
    {
        const creep = this.getCreep();
        const defendCreep = Game.creeps[this.metaData.defendCreep];

        if (!creep || !defendCreep)
        {
            this.completed = true;
            return;
        }

        const hostiles = defendCreep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);

        if (hostiles.length > 0)
        {
            const nearestHostile = creep.pos.findClosestByRange(hostiles) as Creep;
            const attack = creep.attack(nearestHostile);

            if (attack === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(nearestHostile.pos);
            }
            else if (attack !== OK)
            {
                if (creep.rangedAttack(nearestHostile) === ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(nearestHostile.pos);
                }
            }
        }
        else
        {
            if (!creep.pos.inRangeTo(defendCreep.pos, 1))
            {
                creep.moveTo(defendCreep.pos);
            }
        }
    }
}
