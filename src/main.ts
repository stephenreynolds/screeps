import {ErrorMapper} from "./utils/errorMapper";

export const loop = ErrorMapper.wrapLoop(() => {
  // Delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
