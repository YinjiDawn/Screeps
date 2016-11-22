var roleHandler = require('handler.roles');

// Spawners //
var spawnConstructionSite = require('spawn.constructionSite');
var creepSpawner = require('spawn.creep');

// Config //
var roomSourcesConfig = require('config.rooms.sources');


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('R.I.P ' + name + '. You served us well.');
        }
    }
    
    // runDebug();
    
    var mainRoom = Game.rooms['W69N29'];
    var desiredRooms = roomSourcesConfig.getConfig();
    var roomSpawn = mainRoom.find(FIND_MY_SPAWNS)
    creepSpawner.run(mainRoom, roomSpawn[0], desiredRooms);
    roleHandler.run(mainRoom);
    
    for(var i in desiredRooms){
        roleHandler.run(Game.rooms[desiredRooms[i]]);
    }
    
    // spawnConstructionSite.run(mainRoom);
    var roomControllerLevel = mainRoom.controller.level;
}


function runDebug(){
    try {
        var mainRoom = Game.rooms['W69N29'];
        var desiredRooms = ['W69N28']
        // var debugValue = Game.map.describeExits(mainRoom.name);
        // for(var i in debugValue){
        //     console.log(i + ' - ' + debugValue[i])
        //     var foundRoom = Game.rooms[debugValue[i]];
        //     if(foundRoom == undefined){ continue; }
        //     console.log(foundRoom)
        //     if(Game.map.isRoomAvailable(foundRoom.name)) {
        //       console.log("Room" + foundRoom.name + "can be moved to.")
        //     }
        // }
        console.log(findRolesCountInRoom(mainRoom, 'miner'))
        var desiredRoomSourcesIds = []
        
        
    } catch (err) {
        console.log(err);
    }
    
}

function findRolesCountInRoom(room, role){
    var gameCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.assignedRoom == room.name);
    return gameCreeps.length;
}
