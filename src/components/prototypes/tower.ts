interface StructureTower {
  defend(hostile: Creep): void;
}

StructureTower.prototype.defend = function(hostile: Creep) {
  hostile.attack(hostile);
};
