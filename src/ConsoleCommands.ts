import { log } from "Lib/Logger/Log";

const Colors = [
    "cyan",
    "red",
    "green",
    "yellow",
    "white",
    "purple",
    "pink",
    "orange"
];

export const ConsoleCommands = {
    removeConstructionSites(roomName: string, leaveProgressStarted = true, structureType?: string)
    {
        Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).forEach((site) =>
        {
            if ((!structureType || (site as ConstructionSite).structureType === structureType) &&
                (!leaveProgressStarted || (site as ConstructionSite).progress === 0))
            {
                (site as ConstructionSite).remove();
            }
        });
    },

    rc(roomName: string, leaveProgressStarted: boolean, structureType: string)
    {
        this.removeConstructionSites(roomName, leaveProgressStarted, structureType);
    },

    resetMemory()
    {
        for (const entry in Memory)
        {
            delete Memory[entry];
        }
    },

    resetProcesses(roomName?: string)
    {
        if (roomName)
        {
            _.forEach(Memory.kumiOS.processTable, (entry) =>
            {
                if (entry.split("-")[1] === roomName)
                {
                    delete Memory.kumiOS.processTable[entry];
                }
            });
        }
        else
        {
            delete Memory.kumiOS.processTable;
        }
    },

    killall(roomName?: string)
    {
        _.forEach(Game.creeps, (c: Creep) =>
        {
            if ((roomName && c.room.name === roomName) || !roomName)
            {
                c.suicide();
            }
        });
    },

    destroyall(roomName: string, structureType: StructureConstant)
    {
        let sum = 0;

        for (const structure of Game.rooms[roomName].find(FIND_STRUCTURES))
        {
            if (structure.structureType === structureType)
            {
                structure.destroy();
                sum++;
            }
        }

        return "Destroyed " + sum + " " + structureType + "s.";
    },

    showCreepPrefix(roomName: string, prefix: string)
    {
        const room = Game.rooms[roomName];
        let success = false;

        for (const name in Memory.creeps)
        {
            if (room.visual.getSize() < 512000)
            {
                const creep = Game.creeps[name];
                if (creep && creep.name.startsWith(prefix))
                {
                    if (!Memory.visualColor)
                    {
                        Memory.visualColor = Colors[0];
                    }

                    creep.memory.visual = Memory.visualColor;
                    success = true;
                }
            }
            else
            {
                log.warning("Cannot add more visuals this tick.");
            }
        }

        if (success)
        {
            if (Memory.visualColor === Colors[Colors.length])
            {
                Memory.visualColor = Colors[0];
            }
            else
            {
                Memory.visualColor = Colors[Colors.indexOf(Memory.visualColor) + 1];
            }
        }
    },

    clearVisuals(roomName: string)
    {
        delete Memory.visualColor;

        for (const name in Memory.creeps)
        {
            const creep = Game.creeps[name];
            if (creep && creep.room.name === roomName)
            {
                delete creep.memory.visual;
            }
        }
    }
};
