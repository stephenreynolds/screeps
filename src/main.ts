import { ErrorMapper } from "utils/errorMapper";
import { Scheduler } from "os/scheduler";
import { ConsoleCommands } from "utils/consoleCommands";

export const loop = ErrorMapper.wrapLoop(() =>
{
    global.cc = ConsoleCommands;

    const scheduler = new Scheduler();
    scheduler.run();

    getStats();
});

function getStats()
{
    Memory.stats["cpu.getUsed"] = Game.cpu.getUsed();
    Memory.stats["cpu.limit"] = Game.cpu.limit;
    Memory.stats["cpu.bucket"] = Game.cpu.bucket;
    Memory.stats["gcl.progress"] = Game.gcl.progress;
    Memory.stats["gcl.progressTotal"] = Game.gcl.progressTotal;
    Memory.stats["gcl.level"] = Game.gcl.level;
}
