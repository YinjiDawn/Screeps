var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var currentSpawn = Game.rooms[creep.memory.mainRoom].find(FIND_MY_SPAWNS);
        var needWorker = false;
        
        if (checkIfCreepNeedRenew(currentSpawn[0], creep)){ return; }
        checkCreepMemoryBehavior(creep);

        if(creep.memory.upgrading) {
            // Order creep to upgrade room controller //
            creepUpgradeController(creep)
        }
        else {
            // Withdraw resources from one of a list of structuress in the room //
            checkResourceStorage(currentSpawn[0], creep);
        }
    }
};

module.exports = roleUpgrader;

function checkCreepMemoryBehavior(creep){
    if(creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
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

function creepUpgradeController(creep){
    creep.say("U: U");
    creep.memory.currentTask = 'upgrading';
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
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
    var sources = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                                structure.structureType == STRUCTURE_SPAWN ) && (structure.energy == structure.energyCapacity);
                    }
            });
    var containerSources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_STORAGE
                        ) && (structure.store[RESOURCE_ENERGY] > 0);
            }
    });
    
    if (containerSources.length > 0){
        creep.say("U: Wi")
        creep.memory.currentTask = 'withdrawing';
        if(creep.withdraw(containerSources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containerSources[0]);
        }
    }
    else if(sources.length > 0 && !needWorker && !needNonMainWorker) {
        creep.say("U: Wi")
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
            creep.say("U: [W]NW");
            creep.memory.currentTask = 'waiting';
            break;
        case false:
            if (!needNonMainWorker) { 
                creep.say("U: [W]NR"); 
                creep.memory.currentTask = 'waiting';
            }
            break;
    }
    switch(needNonMainWorker){
        case true:
            // Give priority to build miners //
            creep.say("U: [W]NW");
            creep.memory.currentTask = 'waiting';
            break;
        case false:
            creep.say("U: [W]NR");
            creep.memory.currentTask = 'waiting';
            break;
    }
}





