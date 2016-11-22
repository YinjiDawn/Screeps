var spawnCreepConfig = {
    /** Config file **/
    getConfig: function() {
        var jsonConfig = {
            1: {
                "miner": 3,
                "hauler": 2,
                "upgrader": 1,
                "builder":1,
                "reserver": 0,
                "scout": 0
            },
            2: {
                "miner": 4,
                "builder":1,
                "upgrader": 1,
                "hauler": 1,
                "reserver": 0,
                "scout": 0
            },
            3: {
                "miner": 2,
                "builder":1,
                "upgrader": 3,
                "hauler": 2,
                "reserver": 0,
                "scout": 0
            },
            4: {
                "miner": 2,
                "builder":1,
                "upgrader": 1,
                "hauler": 1,
                "reserver": 0,
                "scout": 0
            }
        };
        return jsonConfig;
    },
    
    getNonMainRoomSpawnConfig: function() {
        var jsonConfig = {
            1: {
                "miner": 0,
                "hauler":0
            },
            2: {
                "miner": 0,
                "hauler": 0
            },
            3: {
                "carryMiner": 2,
                "hauler": 4
            },
            4: {
                "carryMiner": 2,
                "carryBuilder": 1,
                "hauler": 2,
                "attacker": 1,
                "reserver": 0
            }
        };
        return jsonConfig;
    }
};

module.exports = spawnCreepConfig;
