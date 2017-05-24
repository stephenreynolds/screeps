const roles = {
  builder: require("../creeps/roles/builder"),
  claimer: require("../creeps/roles/claimer"),
  harvester: require("../creeps/roles/harvester"),
  rampartRepairer: require("../creeps/roles/rampartRepairer"),
  repairer: require("../creeps/roles/repairer"),
  upgrader: require("../creeps/roles/upgrader"),
  wallRepairer: require("../creeps/roles/wallRepairer"),
} as any;

interface Creep {
  runRole(): void;
}

/**
 * Run the creep's role.
 */
Creep.prototype.runRole = function() {
  roles[this.memory.role].run(this);
};
