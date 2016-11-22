var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var currentSpawn = Game.rooms[creep.memory.mainRoom].find(FIND_MY_SPAWNS);
        var needWorker = false;
        var needNonMainWorker = false;

        if (checkIfCreepNeedRenew(currentSpawn[0], creep)){ return; }

        if (!checkIfCreepIsInAssignedRoom(creep)) 
        { 
            return; 
        }

        // Start building //
	    lookForHostileTargets(creep)
    }
};

module.exports = roleAttacker;

function checkIfCreepIsInAssignedRoom(creep){
    var currentRoomName = creep.room.name;
    if (currentRoomName != creep.memory.assignedRoom){
        creep.memory.currentTask = 'attacking';
        creep.say("A: MOV")
        creep.moveTo(new RoomPosition(25, 25, creep.memory.assignedRoom));
        return false;
    } else {

    }
    return true;
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

function lookForHostileTargets(creep){
    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    var miners = findMinersInCreepRoom(creep);
    
    if(target) {
    	creep.say("A: A");
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else {
        if(miners == undefined) { return; }
        creep.say("A: D");
    	creep.moveTo(miners[0]);
    }
}





