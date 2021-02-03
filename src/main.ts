import { ConsoleCommands } from "utils/consoleCommands";
import { CreepBuilder } from "utils/creepBuilder";
import { ErrorMapper } from "utils/errorMapper";
import { ProcessTypes } from "processes/processTypes";
import { RCLPlan } from "processes/management/rclPlans/rclPlan";
import { RoomPathFinder } from "utils/roomPathFinder";
import { Scheduler } from "scheduler";
import { Utils } from "utils/utils";
import profiler from "screeps-profiler";

const enableProfiling = /dev/.exec(__SCRIPT_BRANCH__);
setupProfiling();

export const loop = ErrorMapper.wrapLoop(() => enableProfiling ? profiler.wrap(() => main()) : main());

function main(): void
{
    global.cc = ConsoleCommands;
    global.cc.profiler = Game.profiler;

    const scheduler = new Scheduler();
    scheduler.run();
}

function setupProfiling(): void
{
    if (enableProfiling)
    {
        profiler.enable();

        profiler.registerClass(RCLPlan, "RCLPlan");
        profiler.registerClass(RoomPathFinder, "RoomPathFinder");
        profiler.registerObject(CreepBuilder, "CreepBuilder");
        profiler.registerObject(Utils, "Utils");

        for (const processType in ProcessTypes)
        {
            const type = ProcessTypes[processType];
            profiler.registerClass(type, type.name);
        }
    }
}
