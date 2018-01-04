import { ConsoleCommands } from "Utils/ConsoleCommands";
import { ErrorMapper } from "Utils/ErrorMapper";
import { Kernel } from "./OS/Kernel";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() =>
{
    // Load Memory from the global object if it is there and up to date.
    if (global.lastTick && global.LastMemory && Game.time === (global.lastTick + 1))
    {
        delete global.Memory;
        global.Memory = global.LastMemory;
        RawMemory._parsed = global.LastMemory;
    }
    else
    {
        global.LastMemory = RawMemory._parsed;
        global.roomData = {};
    }
    global.lastTick = Game.time;

    global.cc = ConsoleCommands;

    // Create a new kernel
    const kernel = new Kernel();

    // While the kernel is under the CPU limit
    while (kernel.underLimit() && kernel.needsToRun())
    {
        kernel.runProcess();
    }

    // Tear down the OS
    kernel.teardown();

    Memory.stats["cpu.getUsed"] = Game.cpu.getUsed();
    Memory.stats["cpu.limit"] = Game.cpu.limit;
    Memory.stats["cpu.bucket"] = Game.cpu.bucket;
    Memory.stats["gcl.progress"] = Game.gcl.progress;
    Memory.stats["gcl.progressTotal"] = Game.gcl.progressTotal;
    Memory.stats["gcl.level"] = Game.gcl.level;
});
