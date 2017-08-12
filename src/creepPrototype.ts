const rcl1Roles = {
  harvester: require("rclScripts/rcl1/creeps/harvester"),
  upgrader: require("rclScripts/rcl1/creeps/upgrader")
} as any;

const rcl2Roles = {
  builder: require("rclScripts/rcl2/creeps/builder"),
  courier: require("rclScripts/rcl2/creeps/courier"),
  harvester: require("rclScripts/rcl2/creeps/harvester"),
  healer: require("rclScripts/rcl2/creeps/healer"),
  invader: require("rclScripts/rcl3/creeps/invader"),
  longHarvester: require("rclScripts/rcl2/creeps/longHarvester"),
  miner: require("rclScripts/rcl2/creeps/miner"),
  rampartRepairer: require("rclScripts/rcl2/creeps/rampartRepairer"),
  repairer: require("rclScripts/rcl2/creeps/repairer"),
  scavenger: require("rclScripts/rcl2/creeps/scavenger"),
  sentinel: require("rclScripts/rcl2/creeps/sentinel"),
  upgradeCourier: require("rclScripts/rcl2/creeps/upgradeCourier"),
  upgrader: require("rclScripts/rcl2/creeps/upgrader"),
  wallRepairer: require("rclScripts/rcl2/creeps/wallRepairer")
} as any;

const rcl3Roles = {
  builder: require("rclScripts/rcl3/creeps/builder"),
  courier: require("rclScripts/rcl3/creeps/courier"),
  healer: require("rclScripts/rcl3/creeps/healer"),
  invader: require("rclScripts/rcl3/creeps/invader"),
  longHarvester: require("rclScripts/rcl3/creeps/longHarvester"),
  miner: require("rclScripts/rcl3/creeps/miner"),
  rampartRepairer: require("rclScripts/rcl3/creeps/rampartRepairer"),
  repairer: require("rclScripts/rcl3/creeps/repairer"),
  scavenger: require("rclScripts/rcl3/creeps/scavenger"),
  sentinel: require("rclScripts/rcl3/creeps/sentinel"),
  upgradeCourier: require("rclScripts/rcl3/creeps/upgradeCourier"),
  upgrader: require("rclScripts/rcl3/creeps/upgrader"),
  wallRepairer: require("rclScripts/rcl3/creeps/wallRepairer")
} as any;

const rcl4Roles = {
  builder: require("rclScripts/rcl4/creeps/builder"),
  courier: require("rclScripts/rcl4/creeps/courier"),
  healer: require("rclScripts/rcl4/creeps/healer"),
  invader: require("rclScripts/rcl4/creeps/invader"),
  longHarvester: require("rclScripts/rcl4/creeps/longHarvester"),
  miner: require("rclScripts/rcl4/creeps/miner"),
  rampartRepairer: require("rclScripts/rcl4/creeps/rampartRepairer"),
  repairer: require("rclScripts/rcl4/creeps/repairer"),
  scavenger: require("rclScripts/rcl4/creeps/scavenger"),
  sentinel: require("rclScripts/rcl4/creeps/sentinel"),
  upgradeCourier: require("rclScripts/rcl4/creeps/upgradeCourier"),
  upgrader: require("rclScripts/rcl4/creeps/upgrader"),
  wallRepairer: require("rclScripts/rcl4/creeps/wallRepairer")
} as any;

const rcl5Roles = {
  builder: require("rclScripts/rcl5/creeps/builder"),
  courier: require("rclScripts/rcl5/creeps/courier"),
  healer: require("rclScripts/rcl5/creeps/healer"),
  invader: require("rclScripts/rcl5/creeps/invader"),
  longHarvester: require("rclScripts/rcl5/creeps/longHarvester"),
  miner: require("rclScripts/rcl5/creeps/miner"),
  rampartRepairer: require("rclScripts/rcl5/creeps/rampartRepairer"),
  repairer: require("rclScripts/rcl5/creeps/repairer"),
  scavenger: require("rclScripts/rcl5/creeps/scavenger"),
  sentinel: require("rclScripts/rcl5/creeps/sentinel"),
  upgradeCourier: require("rclScripts/rcl5/creeps/upgradeCourier"),
  upgrader: require("rclScripts/rcl5/creeps/upgrader"),
  wallRepairer: require("rclScripts/rcl5/creeps/wallRepairer")
} as any;

const rcl6Roles = {
  builder: require("rclScripts/rcl6/creeps/builder"),
  courier: require("rclScripts/rcl6/creeps/courier"),
  healer: require("rclScripts/rcl6/creeps/healer"),
  invader: require("rclScripts/rcl6/creeps/invader"),
  longHarvester: require("rclScripts/rcl6/creeps/longHarvester"),
  miner: require("rclScripts/rcl6/creeps/miner"),
  rampartRepairer: require("rclScripts/rcl6/creeps/rampartRepairer"),
  repairer: require("rclScripts/rcl6/creeps/repairer"),
  scavenger: require("rclScripts/rcl6/creeps/scavenger"),
  sentinel: require("rclScripts/rcl6/creeps/sentinel"),
  upgradeCourier: require("rclScripts/rcl6/creeps/upgradeCourier"),
  upgrader: require("rclScripts/rcl6/creeps/upgrader"),
  wallRepairer: require("rclScripts/rcl6/creeps/wallRepairer")
} as any;

const rcl7Roles = {
  builder: require("rclScripts/rcl7/creeps/builder"),
  courier: require("rclScripts/rcl7/creeps/courier"),
  healer: require("rclScripts/rcl7/creeps/healer"),
  invader: require("rclScripts/rcl7/creeps/invader"),
  longHarvester: require("rclScripts/rcl7/creeps/longHarvester"),
  miner: require("rclScripts/rcl7/creeps/miner"),
  rampartRepairer: require("rclScripts/rcl7/creeps/rampartRepairer"),
  repairer: require("rclScripts/rcl7/creeps/repairer"),
  scavenger: require("rclScripts/rcl7/creeps/scavenger"),
  sentinel: require("rclScripts/rcl7/creeps/sentinel"),
  upgradeCourier: require("rclScripts/rcl7/creeps/upgradeCourier"),
  upgrader: require("rclScripts/rcl7/creeps/upgrader"),
  wallRepairer: require("rclScripts/rcl7/creeps/wallRepairer")
} as any;

const rcl8Roles = {
  builder: require("rclScripts/rcl8/creeps/builder"),
  courier: require("rclScripts/rcl8/creeps/courier"),
  healer: require("rclScripts/rcl8/creeps/healer"),
  invader: require("rclScripts/rcl8/creeps/invader"),
  longHarvester: require("rclScripts/rcl8/creeps/longHarvester"),
  miner: require("rclScripts/rcl8/creeps/miner"),
  rampartRepairer: require("rclScripts/rcl8/creeps/rampartRepairer"),
  repairer: require("rclScripts/rcl8/creeps/repairer"),
  scavenger: require("rclScripts/rcl8/creeps/scavenger"),
  sentinel: require("rclScripts/rcl8/creeps/sentinel"),
  upgradeCourier: require("rclScripts/rcl8/creeps/upgradeCourier"),
  upgrader: require("rclScripts/rcl8/creeps/upgrader"),
  wallRepairer: require("rclScripts/rcl8/creeps/wallRepairer")
} as any;

interface Creep {
  runRole(): void;
}

/**
 * Run the creep's role.
 */
Creep.prototype.runRole = function() {
  const home = Game.rooms[this.memory.home];
  switch (home.controller!.level) {
    case 1:
      rcl1Roles[this.memory.role].run(this);
      break;
    case 2:
      rcl2Roles[this.memory.role].run(this);
      break;
    case 3:
      rcl3Roles[this.memory.role].run(this);
      break;
    case 4:
      rcl4Roles[this.memory.role].run(this);
      break;
    case 5:
      rcl5Roles[this.memory.role].run(this);
      break;
  }
};
