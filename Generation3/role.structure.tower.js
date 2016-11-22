var roleTower = {

    /** @param {Creep} creep **/
    run: function(room) {
        defendRoom(room);
        
    }
};

module.exports = roleTower;

function defendRoom(room) {
    var towers = room.find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    var hostiles = room.find(FIND_HOSTILE_CREEPS);
    
    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${room.name}`);
        
        towers.forEach(tower => tower.attack(hostiles[0]));
    } else {
        towers.forEach(tower => repairStructure(tower));
        towers.forEach(tower => healCreeps(tower));
    }
}

function repairStructure(tower){
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
	                    return (structure.structureType == STRUCTURE_WALL ||
	                            structure.structureType == STRUCTURE_ROAD ||
	                            structure.structureType == STRUCTURE_RAMPART ||
	                            structure.structureType == STRUCTURE_SPAWN ||
	                            structure.structureType == STRUCTURE_CONTAINER ||
	                            structure.structureType == STRUCTURE_TOWER) 
	                            && (structure.hits < 3000 || 
	                            (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)
	                            );
	             }
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }
    
}

function healCreeps(tower){
    if(tower) {
        var closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => {
	                    return (
	                            creep.hits < creep.hitsMax
	                           );
	             }
        });
        if(closestDamagedCreep) {
            tower.heal(closestDamagedCreep);
        }
    }
    
}