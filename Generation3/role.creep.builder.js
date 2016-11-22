var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var currentSpawn = Game.rooms[creep.memory.mainRoom].find(FIND_MY_SPAWNS);
        var needWorker = false;
        var needNonMainWorker = false;
        
        if (checkIfCreepNeedRenew(currentSpawn[0], creep)){ return; }

        if (!checkIfCreepIsInAssignedRoom(creep) && creep.memory.currentTask != 'withdrawing') 
        { 
            return; 
        } else if (!checkIfCreepIsInMainRoom(creep) && creep.memory.currentTask == 'withdrawing'){
            return;
        }
        
	    checkCreepMemoryBehavior(creep);

        // Start building //
	    if(creep.memory.building) { 
	        decideBuilderAction(creep);
	    }
	    else { // Go withdraw resources //
	        checkResourceStorage(currentSpawn[0], creep);
	    }
	}
};

module.exports = roleBuilder;

function checkCreepMemoryBehavior(creep){
    if(creep.memory.building && creep.carry.energy < creep.carryCapacity) {
        if(creep.carry.energy == 0){
            creep.memory.building = false;
        }
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }
}

function checkIfCreepIsInAssignedRoom(creep){
    var currentRoomName = creep.room.name;
    if (currentRoomName != creep.memory.assignedRoom && creep.carry.energy == creep.carryCapacity){
        creep.memory.currentTask = 'building';
        creep.say("B: MOV")
        creep.moveTo(new RoomPosition(25, 25, creep.memory.assignedRoom));
        return false;
    } else {

    }
    return true;
}

function checkIfCreepIsInMainRoom(creep){
    var currentRoomName = creep.room.name;
    if (currentRoomName != creep.memory.mainRoom && creep.memory.currentTask == 'withdrawing'){
        creep.say("B: MOV");
        creep.moveTo(new RoomPosition(25, 25, creep.memory.mainRoom));
        return false;
    } else {
        return true;
    }
}

function checkIfCreepNeedRenew(spawn, creep){
    if (creep.ticksToLive >= 1000){ 
        creep.memory.isBeingRenewed = false; 
        creep.memory.needRenew = false;
    }
    if (creep.ticksToLive <= 150 || creep.memory.isBeingRenewed){
        if(spawn.energy == 0){
            return false;
        }
        creep.memory.needRenew = true;
        creep.say("Renewing..")
        if (spawn.renewCreep(creep) == ERR_NOT_IN_RANGE){
            creep.moveTo(spawn);
        } else {
            creep.memory.isBeingRenewed = true;
            spawn.memory.isRenewing = true;
            // creep.withdraw(spawn, RESOURCE_ENERGY); // ##Abuse## Withdraw from spawn to empty it (abuse 1 energy cost for renew)
            // creep.drop(RESOURCE_ENERGY, creep.carry.energy); // ##Abuse## Drop all energy to ground to withdraw all energy from spawn
        }
        return true;
    } else {
        creep.memory.needRenew = false;
        creep.memory.isBeingRenewed = false;
        spawn.memory.isRenewing = false;
        return false;
    }
}

function creepBuild(creep, targets){
    creep.say('B: B');
    creep.memory.currentTask = 'building';
    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
    }
}

function checkIfNeedWorker(spawn){
    var needWorker = false;
    if (spawn.memory.needWorker != undefined){
        needWorker = true;
    } else {
        needWorker = false;
    }
    return needWorker;
}

function checkIfNeedNonMainWorker(spawn){
    var needNonMainWorker = false;
    if (spawn.memory.needNonMainWorker != undefined){
        needNonMainWorker = true;
    } else {
        needNonMainWorker = false;
    }
    return needNonMainWorker;
}

function checkResourceStorage(spawn, creep){
    var needWorker = checkIfNeedWorker(spawn);
    var needNonMainWorker = checkIfNeedNonMainWorker(spawn);
    var sources = Game.rooms[creep.memory.mainRoom].find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                                structure.structureType == STRUCTURE_SPAWN 
                                ) && (structure.energy == structure.energyCapacity);
                    }
            });
    var containerSources = Game.rooms[creep.memory.mainRoom].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE
                        ) && (structure.store[RESOURCE_ENERGY] > 0);
            }
    });
    
    if (containerSources.length > 0){
        creep.say("B: Wi");
        creep.memory.currentTask = 'withdrawing';
        if(creep.withdraw(containerSources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containerSources[0]);
        }
    }
    else if(sources.length > 0 && !needWorker && !needNonMainWorker) {
        creep.say("B: Wi");
        creep.memory.currentTask = 'withdrawing';
        if(creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
    }
    else{
        printWorkerPriorityLog(creep, needWorker, needNonMainWorker);
        creep.moveTo(spawn);
    }
}

function printWorkerPriorityLog(creep, needWorker, needNonMainWorker){
    switch(needWorker){
        case true:
            // Give priority to build miners //
            creep.say("B: [W]NW");
            creep.memory.currentTask = 'waiting';
            break;
        case false:
            if (!needNonMainWorker) {
                creep.say("B: [W]NR");
                creep.memory.currentTask = 'waiting';
            }
            break;
    }
    switch(needNonMainWorker){
        case true:
            // Give priority to build miners //
            creep.say("B: [W]NW");
            creep.memory.currentTask = 'waiting';
            break;
        case false:
            creep.say("B: [W]NR");
            creep.memory.currentTask = 'waiting';
            break;
    }
}

function decideBuilderAction(creep){
    var targets = Game.rooms[creep.memory.assignedRoom].find(FIND_CONSTRUCTION_SITES);
    if(targets.length) {
        creepBuild(creep, targets);
    } else {
    	repairStructure(creep);
    }
}

// Actions //
function repairStructure(creep){
	var targets = Game.rooms[creep.memory.assignedRoom].find(FIND_STRUCTURES, {
	    filter:  (structure) => {
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

	targets.sort((a,b) => a.hits - b.hits);

	if(targets.length > 0) {
	    creep.say("B: R");
	    creep.memory.currentTask = 'repairing';
	    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
	        creep.moveTo(targets[0]);    
	    }
	} else {
	    creep.memory.building = false;
	    creep.moveTo(creep.room.controller);
	}
}

