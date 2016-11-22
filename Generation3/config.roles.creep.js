var rolesCreepConfig = {
    /** Config file **/
    getConfig: function() {
        var arrayConfig = [
            "miner",
            "attacker",
            "carryMiner",
            "builder",
            "carryBuilder",
            "upgrader",
            "hauler",
            "reserver",
            "scout"
            ];
        return arrayConfig;
    }
};

module.exports = rolesCreepConfig;
