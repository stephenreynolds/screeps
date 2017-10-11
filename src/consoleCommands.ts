export const consoleCommands = {
  removeConstructionSites(roomName: string, leaveProgressStarted = true, structureType?: string) {
    Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).forEach((site: ConstructionSite) => {
      if ((!structureType || site.structureType === structureType) && (!leaveProgressStarted || site.progress === 0)) {
        site.remove();
      }
    });
  },

  rc(roomName: string, leaveProgressStarted: boolean, structureType: string) {
    this.removeConstructionSites(roomName, leaveProgressStarted, structureType);
  },
};
