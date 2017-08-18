export function run(rooms: Room[]) {
  console.log("---------------------------------------------");
  console.log("<span style='color:rgba(52, 152, 219, 1.0)'> _                       _               _   </span>");
  console.log("<span style='color:rgba(52, 152, 219, 1.0)'>| |                     (_)             | |  </span>");
  console.log("<span style='color:rgba(52, 152, 219, 1.0)'>| | __ _   _  _ __ ___   _  _ __    ___ | |_ </span>");
  console.log("<span style='color:rgba(52, 152, 219, 1.0)'>| |/ /| | | || '_ ` _ \\ | || '_ \\  / _ \\| __|</span>");
  console.log("<span style='color:rgba(52, 152, 219, 1.0)'>|   < | |_| || | | | | || || | | ||  __/| |_ </span>");
  console.log("<span style='color:rgba(52, 152, 219, 1.0)'>|_|\\_\\ \\__,_||_| |_| |_||_||_| |_| \\___| \\__|</span>");

  const gclProgress = Game.gcl.progress / Game.gcl.progressTotal * 100;
  console.log(`Global Control Level: ${Game.gcl.level} (${gclProgress.toFixed(2)}%)`);

  const cpuPercent = Game.cpu.getUsed() / Game.cpu.limit * 100;
  console.log(`Running ${rooms.length} room(s) with ${Game.cpu.getUsed().toFixed(0)} CPU (${cpuPercent.toFixed(0)}%)`);

  for (const room of rooms) {
    console.log("<span style='color:rgba(142, 68, 173,1.0);'>" + room.name + "</span>");
    console.log("<span style='color:rgba(142, 68, 173,1.0);'>" +
                "##################################################</span>");

    const rclProgress = room.controller!.progress / room.controller!.progressTotal * 100;
    console.log(`Room Control Level: ${room.controller!.level} (${rclProgress.toFixed(2)}%)`);

    if (room.memory.buildTarget !== undefined) {
      const buildTarget = Game.getObjectById(room.memory.buildTarget) as ConstructionSite;
      const buildProgress = buildTarget.progress / buildTarget.progressTotal * 100;
      console.log(`Building ${buildTarget.structureType} (${buildProgress.toFixed(2)}%)`);
    }

    if (room.memory.repairTarget !== undefined) {
      const repairTarget = Game.getObjectById(room.memory.repairTarget) as Structure;
      const repairProgress = repairTarget.hits / repairTarget.hitsMax * 100;
      console.log(`Repairing ${repairTarget.structureType} (${repairProgress.toFixed(2)}%)`);
    }

    if (room.memory.energyTarget !== undefined) {
      const energyTarget = Game.getObjectById(room.memory.energyTarget) as Spawn | Tower | Extension;
      const energyProgress = energyTarget.energy / energyTarget.energyCapacity * 100;
      console.log(`Providing energy to ${energyTarget.structureType} (${energyProgress.toFixed(2)}%)`);
    }
  }
}
