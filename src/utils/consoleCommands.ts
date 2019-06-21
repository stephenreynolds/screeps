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
    removeConstructionSites(roomName: string, leaveProgressStarted = true, structureType?: string): string
    {
        let count = 0;

        Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).forEach((site) =>
        {
            if ((!structureType || (site as ConstructionSite).structureType === structureType) &&
                (!leaveProgressStarted || (site as ConstructionSite).progress === 0))
            {
                (site as ConstructionSite).remove();
                count++;
            }
        });

        return `Removed ${count} construction sites.`;
    },

    rc(roomName: string, leaveProgressStarted: boolean = true, structureType?: string): string
    {
        return this.removeConstructionSites(roomName, leaveProgressStarted, structureType);
    },

    resetProcesses(roomName?: string): string
    {
        let count = 0;

        if (roomName)
        {
            _.forEach(Memory.os.processTable, (entry: any) =>
            {
                if (entry.split("-")[1] === roomName)
                {
                    delete Memory.os.processTable[entry];
                }
            });
        }
        else
        {
            delete Memory.os.processTable;
        }

        return `Reset ${count} processes.`;
    },

    killall(roomName?: string): string
    {
        let count = 0;

        _.forEach(Game.creeps, (c: Creep) =>
        {
            if ((roomName && c.room.name === roomName) || !roomName)
            {
                c.suicide();
                count++;
            }
        });

        return `Killed ${count} creeps.`;
    },

    destroyall(roomName: string, structureType: StructureConstant): string
    {
        let count = 0;

        for (const structure of Game.rooms[roomName].find(FIND_STRUCTURES))
        {
            if (structure.structureType === structureType)
            {
                structure.destroy();
                count++;
            }
        }

        return `Destroyed ${count} ${structureType}s.`;
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
                console.log("Cannot add more visuals this tick.");
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

    clearVisuals(roomName: string): string
    {
        let count = 0;

        delete Memory.visualColor;

        for (const name in Memory.creeps)
        {
            const creep = Game.creeps[name];
            if (creep && creep.room.name === roomName)
            {
                delete creep.memory.visual;
                count++;
            }
        }

        return `Cleared visuals from ${count} creeps.`;
    },

    helpFlags(): string
    {
        const message =
            "Hold:\t\tpurple\n" +
            "Claim:\t\tpurple|red\n" +
            "Remote mining:\tyellow\n" +
            "Ranger:\t\tblue\n" +
            "Invade:\t\tred";

        return message;
    },

    help(): string
    {
        const message =
            "INFO\n" +
            "\tAuthor:   Stephen Reynolds (kumikill) (screeps@stephenreynolds.me)\n" +
            "\tURL:      https://github.com/stephenreynolds/kuminet\n" +
            "\tRevision: " + __REVISION__ + "@" + __BRANCH__ + " on " + __DATE__ + "\n" +
            "\tMessage:  \"" + __MESSAGE__ + "\"\n" +
            "HELP\n" +
            "\thelpFlags()\n\t\tList the different flag types.\n" +
            "CREEPS\n" +
            "\tclearVisuals(roomName: string)\n\t\tClears visual effects from creeps in the room.\n" +
            "\tkillall(roomName?: string)\n\t\tKills all creeps, optionally only in the room given.\n" +
            "\tshowCreepPrefix(roomName: string, prefix: string)\n\t\tPrints creep names in room with the given prefix in their name.\n" +
            "PROCESSES\n" +
            "\tresetProcesses(roomName?: string)\n\t\tKills all processes, optionally only in the given room.\n" +
            "STRUCTURES\n" +
            "\tdestroyall(roomName: string, structureType: StructureConstant)\n\t\tDestroys all of the given structure type in the room.\n" +
            "\tremoveConstructionSites(roomName: string, leaveProgressStarted = true, structureType?: string)\n\t\tRemoves construction sites in a room. Does not remove sites already started by default. Optionally specify a StructureConstant.\n";

        return message;
    }
};
