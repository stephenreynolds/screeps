interface PartList
{
  [name: string]: string[];
}

interface WeightList
{
  [part: string]: number;
}

export const CreepBuilder = {
  design: function(creepType: string, room: Room)
  {
    const body = [].concat(CreepBuilder.typeStarts[creepType] as never[]) as string[];
    const spendCap = room.energyAvailable;

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

    return _.sortBy(body, function(part)
    {
      return CreepBuilder.partWeight[part];
    });
  },

  bodyCost: function(body: string[])
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
