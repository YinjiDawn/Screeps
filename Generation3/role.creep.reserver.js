var roleCreepReserver = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var currentSpawn = Game.rooms[creep.memory.mainRoom].find(FIND_MY_SPAWNS);
        var roomController = Game.rooms[creep.memory.assignedRoom].controller
        var needWorker = false;
        var needNonMainWorker = false;

        if (!checkIfCreepIsInAssignedRoom(creep) && creep.memory.currentTask != 'withdrawing') 
        { 
            return; 
        } else if (!checkIfCreepIsInMainRoom(creep) && creep.memory.currentTask == 'withdrawing'){
            return;
        }
        
        if(creep.carry.energy != creep.carryCapacity && creep.memory.currentTask == 'reserving') {
            creepReserve(creep, roomController);
        }
        else {
            checkResourceStorage(currentSpawn[0], creep);
        }
    }
};
module.exports = roleCreepReserver;

function creepReserve(creep, roomController){

    creep.say('Re: Re');
    creep.memory.currentTask = 'reserving';
    if(creep.reserveController(roomController) == ERR_NOT_IN_RANGE) {
        creep.moveTo(roomController);
    }
}

function checkIfCreepIsInAssignedRoom(creep){
    var currentRoomName = creep.room.name;
    if (currentRoomName != creep.memory.assignedRoom && creep.carry.energy == creep.carryCapacity){
        creep.memory.currentTask = 'reserving';
        creep.say("Re: MOV")
        creep.moveTo(new RoomPosition(25, 25, creep.memory.assignedRoom));
        return false;
    } else {

    }
    return true;
}

function checkIfCreepIsInMainRoom(creep){
    var currentRoomName = creep.room.name;
    if (currentRoomName != creep.memory.mainRoom && creep.memory.currentTask == 'withdrawing'){
        creep.say("Re: MOV");
        creep.moveTo(new RoomPosition(25, 25, creep.memory.mainRoom));
        return false;
    } else {
        return true;
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
        creep.say("Re: Wi");
        creep.memory.currentTask = 'withdrawing';
        if(creep.withdraw(containerSources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containerSources[0]);
        }
    }
    else if(sources.length > 0 && !needWorker && !needNonMainWorker) {
        creep.say("Re: Wi");
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
            creep.say("Re: [W]NW");
            creep.memory.currentTask = 'waiting';
            break;
        case false:
            if (!needNonMainWorker) {
                creep.say("Re: [W]NR");
                creep.memory.currentTask = 'waiting';
            }
            break;
    }
    switch(needNonMainWorker){
        case true:
            // Give priority to build miners //
            creep.say("Re: [W]NW");
            creep.memory.currentTask = 'waiting';
            break;
        case false:
            creep.say("Re: [W]NR");
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


