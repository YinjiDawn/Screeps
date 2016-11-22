var bodyPartsConfig = require('config.creep.bodyParts');
var creepConfig = require('config.spawn.creep');
var rolesCreepConfig = require('config.roles.creep');

var creepSpawner = {

    /** @param {Room} room, {Spawn} spawn **/
    run: function(room, spawn, desiredRooms) {
        var spawn = room.find(FIND_MY_SPAWNS)[0];

        renewNearbyCreeps(spawn);
        
        //spawn.pos.isNearTo(testCreeps)

        calculateMaxSpawnExtensionEnergy(room, spawn);
        
        checkIfToCreateMainRoomCreeps(room, spawn);
        
        if(!spawn.memory.isSpawning && !spawn.memory.needWorker){
            for(var i in desiredRooms){
                checkIfToCreateNonMainCreeps(desiredRooms[i], spawn);
            } 
        }
    }
};

module.exports = creepSpawner;

function checkEnergyAmount(spawn){
    if (spawn.energy + spawn.memory.extensionEnergy >= 300){
        return true;
    } else {
        return false;
    }
}

function renewNearbyCreeps(spawn){
    var testCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler' && creep.pos.isNearTo(spawn) && creep.ticksToLive < 1000);
    if(testCreeps.length > 0 && !spawn.memory.isRenewing && !spawn.memory.isSpawning){
        spawn.renewCreep(testCreeps[0]);
    }
}

function getCreepCountByRole(room, spawn){
    var config_rolesCreep = rolesCreepConfig.getConfig();
    var roomCreeps = room.find(FIND_MY_CREEPS, {
                    filter: (creep) => {
                        return (
                                creep.memory.assignedRoom == room.name  
                                );
                    }
            });
    var creepCountByRole = {};
    
    for(var role in config_rolesCreep){
        creepCountByRole[config_rolesCreep[role]] = 0;
        var creepCount = _.filter(roomCreeps, (creep) => creep.memory.role == config_rolesCreep[role]).length;
        creepCountByRole[config_rolesCreep[role]] += creepCount; 
    }
    
    spawn.memory.creepCountByRole = creepCountByRole; // Save creep count to spawn's memory
    return creepCountByRole;
}

function printCreepCount(creepCountByRole, role){
     if (Game.time % 10 == 0){
        console.log(role + 's: ' + creepCountByRole[role]);
    }
}

function checkIfToCreateMainRoomCreeps(room, spawn){
    var config_bodyParts = bodyPartsConfig.getConfig();
    var config_rolesCreep = rolesCreepConfig.getConfig();
    var config_spawnCreep = creepConfig.getConfig();
    
    var creepCountByRole = getCreepCountByRole(room, spawn);
    var roomControllerLevel = room.controller.level;
    var maxEnergyExtensionCapacity = calculateMaxSpawnExtensionEnergy(room, spawn);
    
    // console.log(maxEnergyExtensionCapacity)

    if (!spawn.spawning){ spawn.memory.isSpawning = false; }

    for(var role in config_rolesCreep){ 
        
        // printCreepCount(creepCountByRole, role);
// || config_rolesCreep[role] == 'hauler'
        if(findRolesCountInRoomByRoom(room, config_rolesCreep[role]) < config_spawnCreep[roomControllerLevel][config_rolesCreep[role]]){
            if (config_rolesCreep[role] == 'miner' || config_rolesCreep[role] == 'hauler' ){ // Give priority to build miners and haulers //
                spawn.memory.needWorker = config_rolesCreep[role];
            }
            
            if (spawn.canCreateCreep(config_bodyParts[roomControllerLevel][config_rolesCreep[role]]) == 0 && !spawn.memory.isSpawning){
                var newName = spawn.createCreep(config_bodyParts[roomControllerLevel][config_rolesCreep[role]], undefined, {role: config_rolesCreep[role] , mainRoom: spawn.room.name, assignedRoom: room.name});
                spawn.memory.isSpawning = true;
                console.log('Spawning new ' + config_rolesCreep[role] + ': ' + newName + ' in room: ' + room.name);
            }
        } else {
            if (config_rolesCreep[role] == 'miner'  ){ // Give priority to build miners and haulers  //
                // var skipNeedWorker = true;
                // switch(spawn.memory.needWorker){
                //     case 'miner':
                //         skipNeedWorker = false;
                //         break;
                //     case 'hauler':
                //         skipNeedWorker = false;
                //         break;
                //     default:
                //         spawn.memory.needWorker = undefined;
                // }
                // if (skipNeedWorker){ spawn.memory.needWorker = undefined; }
                spawn.memory.needWorker = undefined;
            }
        }
    }
    
}

function checkIfToCreateNonMainCreeps(roomName, spawn){
    var desiredRoom = Game.rooms[roomName]
    var config_bodyParts = bodyPartsConfig.getConfig();
    var config_spawnNonMainRoomCreeps = creepConfig.getNonMainRoomSpawnConfig();
    var config_rolesCreep = rolesCreepConfig.getConfig()
    
    // var creepCountByRole = getCreepCountByRole(desiredRoom, spawn);
    var roomControllerLevel = spawn.room.controller.level;
    var maxEnergyExtensionCapacity = calculateMaxSpawnExtensionEnergy(spawn.room, spawn);
    
    // console.log(maxEnergyExtensionCapacity)
    
    if (!spawn.spawning){ spawn.memory.isSpawning = false; }

    for(var role in config_rolesCreep){
        // console.log(spawn.canCreateCreep(config_bodyParts[roomControllerLevel]["carryBuilder"]))
        // printCreepCount(creepCountByRole, role);

        if(findRolesCountInRoomByRoomName(roomName, config_rolesCreep[role]) < config_spawnNonMainRoomCreeps[roomControllerLevel][config_rolesCreep[role]]){
            if (config_rolesCreep[role] == 'carryMiner' || config_rolesCreep[role] == 'hauler'){ // Give priority to build miners and haulers //
                spawn.memory.needNonMainWorker = config_rolesCreep[role];
            }
            
            if (spawn.canCreateCreep(config_bodyParts[roomControllerLevel][config_rolesCreep[role]]) == 0 && !spawn.memory.isSpawning){
                var newName = spawn.createCreep(config_bodyParts[roomControllerLevel][config_rolesCreep[role]], undefined, {role: config_rolesCreep[role], mainRoom: spawn.room.name, assignedRoom: roomName});
                spawn.memory.isSpawning = true;
                console.log('Spawning new ' + config_rolesCreep[role] + ': ' + newName + ' in room: ' + spawn.room.name + ' for room: ' + roomName);
            }
        } else {
            if (config_rolesCreep[role] == 'carryMiner' || config_rolesCreep[role] == 'hauler'){ // Give priority to build miners and haulers//
                // console.log(roomName + ' - ' + config_rolesCreep[role])
                spawn.memory.needNonMainWorker = undefined;
            }
        }
    }
    
}

function findRolesCountInRoomByRoom(room, role){
    var gameCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.assignedRoom == room.name);
    // console.log(role + ' - ' + gameCreeps.length + ' - ' + room.name);
    return gameCreeps.length;
}

function findRolesCountInRoomByRoomName(roomName, role){
    var gameCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.assignedRoom == roomName);
    // console.log(role + ' - ' + gameCreeps.length + ' - ' + room.name);
    return gameCreeps.length;
}


function calculateCurrentSpawnExtensionEnergy(room, spawn){
    var roomExtensions = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION)
            }
    });
    spawn.memory.extensionEnergy = 0;
    for(var i in roomExtensions){
        spawn.memory.extensionEnergy = spawn.memory.extensionEnergy + roomExtensions[i].energy;
    }
}

function calculateMaxSpawnExtensionEnergy(room, spawn){
    var roomExtensions = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION)
            }
    });
    var maxExtensionEnergy = 0;
    for(var i in roomExtensions){
        maxExtensionEnergy += roomExtensions[i].energyCapacity;
    }
    return maxExtensionEnergy;
}




