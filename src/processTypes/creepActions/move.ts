import { Process } from "../../os/process";

interface MoveMetaData
{
  creep: string;
  pos: {
    x: number
    y: number
    roomName: string
  };
  range: number;
}

export class MoveProcess extends Process
{
  public metaData: MoveMetaData;
  public type = "move";

  public run()
  {
    const creep = Game.creeps[this.metaData.creep];

    if (!creep || !this.metaData.pos)
    {
      this.completed = true;
      this.resumeParent();
      return;
    }

    const target = new RoomPosition(this.metaData.pos.x, this.metaData.pos.y, this.metaData.pos.roomName);

    if (creep.fatigue === 0)
    {
      if (creep.pos.inRangeTo(target, this.metaData.range) || creep.pos.isEqualTo(target))
      {
        this.completed = true;
        this.resumeParent();
      }
      else
      {
        creep.moveTo(target, {
          visualizePathStyle: {
            fill: "transparent",
            lineStyle: "dashed",
            opacity: .1,
            stroke: "#fff",
            strokeWidth: .15
          }
        });
      }
    }
    else
    {
      let decreasePerTick = 0;
      _.forEach(creep.body, function(part)
      {
        if (part.type === MOVE)
        {
          decreasePerTick += 2;
        }
      });

      const ticks = Math.ceil(creep.fatigue / decreasePerTick);

      this.suspend = ticks;
    }
  }
}
