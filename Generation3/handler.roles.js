var roleCreepMiner = require('role.creep.miner');
var roleCreepUpgrader = require('role.creep.upgrader');
var roleCreepBuilder = require('role.creep.builder');
var roleCreepHauler = require('role.creep.hauler');
var roleCreepReserver = require('role.creep.reserver');
var roleCreepAttacker = require('role.creep.attacker');
var roleStructureTower = require ('role.structure.tower');

var roleHandler = {

    /** @param {Creep} creep **/
    run: function(room) {
        if (room == undefined){ return; }
        handleCreepRoles(room);
        handleDefenseTower(room);
    }
};

module.exports = roleHandler;

function handleCreepRoles(room){
    var roomCreeps = room.find(FIND_MY_CREEPS);
    
    if (room.name == 'W69N28'){
        
    }
    
    for (var i in roomCreeps) {
        var creep = roomCreeps[i]
        var creepRole = creep.memory.role;
        switch(creepRole){
            case 'miner':
                roleCreepMiner.run(creep);
                break;
            case 'carryMiner':
                roleCreepMiner.run(creep);
                break;
            case 'upgrader':
                roleCreepUpgrader.run(creep);
                break;
            case 'builder':
                roleCreepBuilder.run(creep);
                break;
            case 'carryBuilder':
                roleCreepBuilder.run(creep);
                break;
            case 'hauler':
                roleCreepHauler.run(creep);
                break;
            case 'reserver':
                roleCreepReserver.run(creep);
                break;
            case 'attacker':
                roleCreepAttacker.run(creep);
                break;
        }

    }
}

function handleDefenseTower(room){
    roleStructureTower.run(room);
}