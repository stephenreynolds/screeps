import * as Config from "config";
import * as ConsoleCommands from "consoleCommands";
import * as Profiler from "screeps-profiler";
import { Kernel } from "./Kernel";

if (Config.USE_PROFILER)
{
    Profiler.enable();
}

function main()
{
    // Add custom commands to console.
    global.cc = ConsoleCommands;

    // Check memory for null or out of bounds custom objects.
    if (!Memory.uuid || Memory.uuid > 100)
    {
        Memory.uuid = 0;
    }

    // Run kernel.
    const kernel = new Kernel();
    while (kernel.underLimit() && kernel.needsToRun())
    {
        kernel.runProcess();
    }
    kernel.deconstruct();
}

export const loop = !Config.USE_PROFILER ? main : () => { Profiler.wrap(main); };
