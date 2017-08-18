const roles = {
  accountant: require("creeps/accountant"),
  builder: require("creeps/builder"),
  courier: require("creeps/courier"),
  healer: require("creeps/healer"),
  invader: require("creeps/invader"),
  longHarvester: require("creeps/longHarvester"),
  miner: require("creeps/miner"),
  rampartRepairer: require("creeps/rampartRepairer"),
  repairer: require("creeps/repairer"),
  scavenger: require("creeps/scavenger"),
  sentinel: require("creeps/sentinel"),
  transporter: require("creeps/transporter"),
  upgrader: require("creeps/upgrader"),
  wallRepairer: require("creeps/wallRepairer")
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
