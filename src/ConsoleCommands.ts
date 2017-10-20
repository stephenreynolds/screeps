export const ConsoleCommands = {
    removeConstructionSites(roomName: string, leaveProgressStarted = true, structureType?: string)
    {
        Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).forEach((site: ConstructionSite) =>
        {
            if ((!structureType || site.structureType === structureType) &&
                (!leaveProgressStarted || site.progress === 0))
            {
                site.remove();
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
            _.forEach(Memory.kumiOS.processTable, (entry) => {
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
    }
};
