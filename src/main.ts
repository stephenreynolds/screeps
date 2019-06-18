import { ErrorMapper } from "utils/ErrorMapper";
import { Harvester } from "roles/roleHarvester";

export const loop = ErrorMapper.wrapLoop(() =>
{
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps)
    {
        if (!(name in Game.creeps))
        {
            delete Memory.creeps[name];
        }
    }

    for (let name in Game.creeps)
    {
        let creep = Game.creeps[name];
        Harvester.run(creep);
    }
});
