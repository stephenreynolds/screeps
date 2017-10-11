const roles = {
  accountant: require("creeps/accountant"),
  builder: require("creeps/builder"),
  claimer: require("creeps/claimer"),
  courier: require("creeps/courier"),
  healer: require("creeps/healer"),
  invader: require("creeps/invader"),
  longHarvester: require("creeps/longHarvester"),
  miner: require("creeps/miner"),
  rampartRepairer: require("creeps/rampartRepairer"),
  repairer: require("creeps/repairer"),
  reserver: require("creeps/reserver"),
  sentinel: require("creeps/sentinel"),
  transporter: require("creeps/transporter"),
  upgrader: require("creeps/upgrader"),
  wallRepairer: require("creeps/wallRepairer")
} as any;

interface Creep {
  runRole(): void;
  moveToTarget(target: RoomPosition): void;
  moveToRoom(roomName: string): boolean;
  workingToggle(): void;
  getResourceFromSource(sources: Source[] | Mineral[]): number | undefined;
}

/**
 * Run the creep's role.
 */
Creep.prototype.runRole = function() {
  roles[this.memory.role].run(this);
};

Creep.prototype.moveToTarget = function(target: RoomPosition) {
  this.memory.moveTarget = target;
  this.moveTo(this.memory.moveTarget, {
    reusePath: 7, visualizePathStyle: {
      fill: "transparent",
      lineStyle: "dashed",
      opacity: .1,
      stroke: "#fff",
      strokeWidth: .15
    }
  });
};

Creep.prototype.moveToRoom = function(roomName: string) {
  if (this.room.name === roomName && (this.pos.x * this.pos.y === 0 ||
    Math.abs(this.pos.x) === 49 || Math.abs(this.pos.y) === 49)) {
    const pos = new RoomPosition(25, 25, roomName);
    this.moveToTarget(pos);
  }
  else if (this.room.name === roomName) {
    return false;
  }
  else if (this.room.name !== roomName) {
    this.moveToTarget(Game.flags[roomName + "-NAV"].pos);
  }

  return true;
};

Creep.prototype.workingToggle = function() {
  if (this.memory.working && _.sum(this.carry) === 0) {
    this.memory.working = false;
  }
  else if (!this.memory.working && _.sum(this.carry) === this.carryCapacity) {
    this.memory.working = true;
  }
};

Creep.prototype.getResourceFromSource = function(sources: Source[] | Mineral[]): number | undefined {
  if (this.memory.targetSourceId !== undefined) {
    const source = Game.getObjectById<Source>(this.memory.targetSourceId);

    if (source !== null) {
      const action = this.harvest(source);

      if (action === ERR_NOT_IN_RANGE) {
        this.moveToTarget(source.pos);
      }

      return action;
    }
    else {
      this.memory.targetSourceId = undefined;
    }
  }
  else {
    const source = _.sample(sources) as Source;

    if (source !== undefined) {
      this.memory.targetSourceId = source.id;
    }
  }
};
