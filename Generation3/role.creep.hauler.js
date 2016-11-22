var roleCreepHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // var currentSpawn = creep.room.find(FIND_MY_SPAWNS);
        var currentSpawn = Game.rooms[creep.memory.mainRoom].find(FIND_MY_SPAWNS);
        
        if (checkIfCreepNeedRenew(currentSpawn[0], creep)){ return; }
        
        if (!checkIfCreepIsInAssignedRoom(creep) && creep.memory.currentTask != 'storing') 
        { 
            return; 
        } else if (!checkIfCreepIsInMainRoom(creep) && creep.memory.currentTask == 'storing'){
            return;
        }
        
        
        
        if(creep.carry.energy != creep.carryCapacity && creep.memory.currentTask == 'hauling') {
            creepHaul(creep);
        }
        else {
            decideWhereToStore(currentSpawn[0], creep)
        }
    }
};
module.exports = roleCreepHauler;

function creepHaul(creep){
    var miners = findMinersInCreepRoom(creep);
    var minersToHaulFrom = findMinerToHaulFrom(creep);
    var droppedResources = creep.room.find(FIND_DROPPED_ENERGY);
    var sourcesInAssignedRoom = Game.rooms[creep.memory.assignedRoom].find(FIND_SOURCES)
    
    creep.memory.currentTask = 'hauling';
    if (minersToHaulFrom.length > 0){
        creep.say("Ha: Ha");
        if (minersToHaulFrom[0].transfer(creep, RESOURCE_ENERGY, creep.energyCapacity-creep.carry.energy) == ERR_NOT_IN_RANGE){
            creep.moveTo(minersToHaulFrom[0]);
        }
    } else if (droppedResources.length > 0){
        pickupDroppedEnergy(droppedResources, creep);
    }
    else {
        creep.say("Ha: [W]NR");
        if(miners == undefined) { return; }
        creep.moveTo(miners[0]);
    }
}

function findMinersInCreepRoom(creep){
    var roomCreeps = Game.rooms[creep.memory.assignedRoom].find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return (
                    creep.memory.role == 'miner' ||
                    creep.memory.role == 'carryMiner'
                    );
        }
    });
    return roomCreeps;
}

function findMinerToHaulFrom(creep){
    var roomCreeps = creep.room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return (
                    creep.memory.role == 'miner' ||
                    creep.memory.role == 'carryMiner'
                    ) && creep.carry.energy >= 100;
        }
    });
    return roomCreeps;
}

function checkIfCreepIsInAssignedRoom(creep){
    var currentRoomName = creep.room.name;
    if (currentRoomName != creep.memory.assignedRoom && creep.carry.energy == 0){
        creep.memory.currentTask = 'hauling';
        creep.say("Ha: MOV")
        creep.moveTo(new RoomPosition(25, 25, creep.memory.assignedRoom));
        return false;
    } else {

    }
    return true;
}

function checkIfCreepIsInMainRoom(creep){
    var currentRoomName = creep.room.name;
    if (currentRoomName != creep.memory.mainRoom){
        creep.say("Ha: MOV");
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


function pickupDroppedEnergy(droppedResources, creep){
    creep.say("Ha: DE");
    if(creep.pickup(droppedResources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(droppedResources[0]);
    }
}

function decideWhereToStore(spawn,creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_STORAGE 
                        ) && (structure.energy < structure.energyCapacity || 
	                         (structure.structureType == STRUCTURE_TOWER && structure.energy < 500) || 
	                         (structure.structureType == STRUCTURE_SPAWN && structure.energy < 100)
	                    );
            }
    });
    var targetContainer = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_STORAGE ||
                    structure.structureType == STRUCTURE_CONTAINER 
                    ) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
    });
    
    if(creep.carry.energy == 0){
       creep.memory.currentTask = 'hauling';
       return;
    }
    
    // console.log(targetContainer.length)

    if(targets.length > 0) {
        
        creep.say("Ha: [Ha]");
        creep.memory.currentTask = 'storing';
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
    }
    else if(targetContainer.length > 0) {
            // console.log(targetContainer[0].structureType)
            creep.say("Ha: [Ha]");
            creep.memory.currentTask = 'storing';
            var structType = targetContainer[0].structureType;
            // console.log(structType)
            switch(structType){
                case 'container':
                    if (!creep.pos.isEqualTo(targetContainer[0].pos)){
                        creep.moveTo(targetContainer[0])
                    } else {
                        creep.drop(RESOURCE_ENERGY, creep.carry.energy);
                    }
                    break;
                case 'storage':
                    if(creep.transfer(targetContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetContainer[0]);
                    }
                    // if (!creep.pos.inRangeTo(targetContainer[0].pos, 1)){
                    //     creep.moveTo(targetContainer[0])
                    // } else {
                    //     // creep.drop(RESOURCE_ENERGY, creep.carry.energy);
                    //     creep.transfer(targetContainer[0], RESOURCE_ENERGY)
                    // }
                    break;
            }
            
    }
    else {
        // creep.say("Spawn full.");
        creep.memory.currentTask = 'storing';
        creep.moveTo(spawn);
    } 
}


