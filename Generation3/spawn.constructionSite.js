var spawnConstructionSite = {

    /** @param {Room} room **/
    run: function(room) {
        var currentRoom = room
        var roomCreeps = currentRoom.find(FIND_MY_CREEPS);
        
        for(var i in roomCreeps){
            var creep = roomCreeps[i]
            if (isCreepOnRoad(creep)){
                // console.log("add road to list.")
            }
        }
        // var predefined_roads = [[14,14]]
        // for(var i in predefined_roads){
        //     var road = predefined_roads[i]
        //     var checkRoad = room.getPositionAt(road[0],road[1]).look()[0].structure
        //     var checkRoadOccupied = room.getPositionAt(road[0],road[1]).look()[1].structure
        //     // console.log(checkRoad)
        //     // console.log(checkRoadOccupied)
        //     if (checkRoad.strcuture == undefined && checkRoadOccupied.structure == undefined){
        //         console.log('need to build road here');
        //         currentRoom.getPositionAt(road[0],road[1]).createConstructionSite(STRUCTURE_WALL)
        //     }
        // }
        
    }
};

module.exports = spawnConstructionSite;

function isCreepOnRoad(creep){
    // var look = creep.pos.
// 	console.log(creep.pos)
}