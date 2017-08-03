const roles = {
  builder: require("../creeps/roles/builder"),
  claimer: require("../creeps/roles/claimer"),
  courier: require("../creeps/roles/courier"),
  harvester: require("../creeps/roles/harvester"),
  healer: require("../creeps/roles/healer"),
  miner: require("../creeps/roles/miner"),
  rampartRepairer: require("../creeps/roles/rampartRepairer"),
  repairer: require("../creeps/roles/repairer"),
  sentinel: require("../creeps/roles/sentinel"),
  transporter: require("../creeps/roles/transporter"),
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
