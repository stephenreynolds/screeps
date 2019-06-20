interface PartList
{
    [name: string]: BodyPartConstant[];
}

interface WeightList
{
    [part: string]: number;
}

export const CreepBuilder = {
    design: (creepType: string, room: Room) =>
    {
        const body = [].concat(CreepBuilder.typeStarts[creepType] as never[]) as BodyPartConstant[];
        const spendCap = Math.max(room.energyAvailable / 2, 300);

        let add = true;
        let extendIndex = 0;

        while (add)
        {
            const creepCost = CreepBuilder.bodyCost(body);

            const nextPart = CreepBuilder.typeExtends[creepType][extendIndex];

            if (
                creepCost + BODYPART_COST[nextPart] > spendCap
                ||
                body.length === CreepBuilder.typeLengths[creepType]
            )
            {
                add = false;
            }
            else
            {
                body.push(CreepBuilder.typeExtends[creepType][extendIndex]);
                extendIndex += 1;
                if (extendIndex === CreepBuilder.typeExtends[creepType].length)
                {
                    extendIndex = 0;
                }
            }
        }

        return _.sortBy(body, (part: BodyPartConstant) =>
        {
            return CreepBuilder.partWeight[part];
        });
    },

    bodyCost: (body: BodyPartConstant[]) =>
    {
        let cost = 0;

        for (const part in body)
        {
            cost += BODYPART_COST[body[part]];
        }

        return cost;
    },

    partWeight: {
        attack: 15,
        carry: 8,
        claim: 9,
        heal: 20,
        move: 5,
        ranged_attack: 14,
        tough: 1,
        work: 10
    } as WeightList,

    typeStarts: {
        brawler: [ATTACK, TOUGH, MOVE, MOVE],
        claimer: [CLAIM, MOVE],
        harvester: [WORK, WORK, CARRY, MOVE],
        hold: [CLAIM, CLAIM, MOVE, MOVE],
        mover: [CARRY, MOVE],
        bunkerMover: [MOVE, CARRY],
        ranger: [RANGED_ATTACK, TOUGH, MOVE, MOVE],
        worker: [WORK, CARRY, MOVE, MOVE],
        miner: [WORK, WORK, CARRY, MOVE]
    } as PartList,

    typeExtends: {
        brawler: [ATTACK, TOUGH, MOVE, MOVE],
        claimer: [],
        harvester: [WORK, MOVE],
        hold: [],
        mover: [CARRY, MOVE],
        bunkerMover: [CARRY],
        ranger: [RANGED_ATTACK, TOUGH, MOVE, MOVE],
        worker: [WORK, CARRY, MOVE, MOVE],
        miner: [WORK]
    } as PartList,

    typeLengths: {
        brawler: 20,
        claimer: 2,
        harvester: 12,
        hold: 4,
        mover: 14,
        bunkerMover: 17,
        ranger: 20,
        worker: 16,
        miner: 7
    } as { [name: string]: number }
};
