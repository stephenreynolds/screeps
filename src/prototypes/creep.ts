const roles = {
  builder: require("../creeps/builder"),
  claimer: require("../creeps/claimer"),
  courier: require("../creeps/courier"),
  harvester: require("../creeps/harvester"),
  healer: require("../creeps/healer"),
  invader: require("../creeps/invader"),
  miner: require("../creeps/miner"),
  mineralMiner: require("../creeps/mineralMiner"),
  rampartRepairer: require("../creeps/rampartRepairer"),
  repairer: require("../creeps/repairer"),
  reserver: require("../creeps/reserver"),
  scavenger: require("../creeps/scavenger"),
  sentinel: require("../creeps/sentinel"),
  transporter: require("../creeps/transporter"),
  upgrader: require("../creeps/upgrader"),
  wallRepairer: require("../creeps/wallRepairer"),
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
