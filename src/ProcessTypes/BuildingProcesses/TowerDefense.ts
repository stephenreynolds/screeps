import { Process } from "../../OS/Process";

export class TowerDefenseProcess extends Process
{
  public type = "td";

  public run()
  {
    const room = Game.rooms[this.metaData.roomName];

    if (!room)
    {
      this.completed = true;
      return;
    }

    const enemies = room.find(FIND_HOSTILE_CREEPS) as Creep[];

    if (enemies.length > 0)
    {
      _.forEach(this.kernel.data.roomData[this.metaData.roomName].towers, (tower) =>
      {
        const enemy = tower.pos.findClosestByRange(enemies);

        tower.attack(enemy);
      });

      if (!this.metaData.runTime)
      {
        this.metaData.runTime = 0;
      }
      else
      {
        this.metaData.runTime += 1;
      }
    }
    else
    {
      this.completed = true;
    }
  }
}
