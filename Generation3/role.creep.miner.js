var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var currentSpawn = Game.rooms[creep.memory.mainRoom].find(FIND_MY_SPAWNS);
        
        if (!checkIfCreepIsInAssignedRoom(creep)) { return; }

        if(creep.carry.energy < creep.carryCapacity && creep.memory.currentTask == 'mining') {
            creepMine(creep);
        }
        else {
            decideWhereToStore(currentSpawn[0], creep)
        }
    }
};
module.exports = roleMiner;

function creepMine(creep){
    var sources = creep.room.find(FIND_SOURCES);
    creep.say('Mi: M');
    creep.memory.currentTask = 'mining';
    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
    }
}

function findHaulerInRoom(spawn, creep){
    var gameCreeps = _.filter(Game.creeps, (gameCreep) => gameCreep.memory.role == 'hauler'  && gameCreep.memory.assignedRoom == creep.memory.assignedRoom);
    return gameCreeps.length;
    // if(!spawn){ return 99; }
    // return spawn.memory.creepCountByRole['hauler'];
}

function checkIfCreepIsInAssignedRoom(creep){
    var currentRoomName = creep.room.name;
    if (currentRoomName != creep.memory.assignedRoom){
        creep.memory.currentTask = 'mining';
        creep.say("Mi: MOV");
        creep.moveTo(new RoomPosition(25, 25, creep.memory.assignedRoom));
        return false;
    } 
    else {
       return true;
    }
}


function decideWhereToStore(spawn, creep){
    var sources = Game.rooms[creep.memory.assignedRoom].find(FIND_SOURCES);
    var targets = Game.rooms[creep.memory.mainRoom].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER
                        ) && structure.energy < structure.energyCapacity;
            }
    });
    var targetContainer = Game.rooms[creep.memory.mainRoom].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType == STRUCTURE_CONTAINER
                    ) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
            }
    });

    var roomHaulersCount = findHaulerInRoom(spawn, creep);
    
    if(roomHaulersCount <= 0){
        if(creep.carry.energy == 0){
           creep.memory.currentTask = 'mining';
           return;
        }
        if(targets.length > 0) {
            creep.say("Mi: [M]");
            creep.memory.currentTask = 'storing';
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            } else {
                if(creep.carry.energy == 0){
                   creep.memory.currentTask = 'mining';
                }
            }
        }
        else if(targetContainer.length > 0) {
                creep.say("Mi: [M]");
                creep.memory.currentTask = 'storing';
                if (!creep.pos.isEqualTo(targetContainer[0].pos)){
                    creep.moveTo(targetContainer[0])
                } else {
                    creep.drop(RESOURCE_ENERGY, creep.carry.energy);
                }
        }
        else {
            creep.say("Spawn full.");
            creep.memory.currentTask = 'waiting';
            creep.moveTo(spawn);
        } 
    } else {
        if(creep.carry.energy < creep.carryCapacity){
           creep.memory.currentTask = 'mining';
           return;
        }
        creep.say("Wait Haul");
        creep.memory.currentTask = 'waiting';
        creep.moveTo(sources[0]);
    }
}


