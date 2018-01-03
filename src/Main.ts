import { ErrorMapper } from "Utils/ErrorMapper";
import { ConsoleCommands } from "./ConsoleCommands";
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
});
