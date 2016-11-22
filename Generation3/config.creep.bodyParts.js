var bodyPartsConfig = {
    /** Config file **/
    getConfig: function() {
        var jsonConfig = {
            1: {
                "miner": [WORK,WORK,CARRY,MOVE],
                "hauler": [CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
                "upgrader": [WORK,WORK,CARRY,MOVE],
                "builder": [WORK,WORK,CARRY,MOVE],
                "scout": [WORK,CARRY,MOVE,MOVE]
            },
            2: {
                "builder": [WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                "upgrader": [WORK,WORK,CARRY,MOVE,MOVE],
                "miner": [WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                "scout": [WORK,CARRY,MOVE,MOVE,MOVE,MOVE]
            },
            3: {
                "builder": [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], // 450
                "upgrader": [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], // 600
                "miner": [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE], // 650
                "carryMiner": [WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], // 600
                "hauler": [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], // 600
                "reserver": [CLAIM,CARRY,CARRY,MOVE,MOVE], // 800
                "scout": [WORK,CARRY,MOVE,MOVE,MOVE,MOVE] // 300
            },
            4: {
                "builder": [WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], // 650
                "carryBuilder": [WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], // 650
                "upgrader": [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], // 600
                "miner": [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], // 650
                "carryMiner": [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], // 700
                "hauler": [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], // 800
                "reserver": [CLAIM,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], // 950
                "attacker": [ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH], // 820
                "scout": [WORK,CARRY,MOVE,MOVE,MOVE,MOVE] // 300
            }
        };
        return jsonConfig;
    }
};

module.exports = bodyPartsConfig;
