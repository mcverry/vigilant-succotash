"use strict";
var CollisionManager = (function () {
    function CollisionManager(game) {
        this.catCollisionGroup = game.physics.p2.createCollisionGroup();
        this.wallsCollisionGroup = game.physics.p2.createCollisionGroup();
        this.pawCollisionGroup = game.physics.p2.createCollisionGroup();
        this.sensorCollisionGroup = game.physics.p2.createCollisionGroup();
        this.fishCollisionGroup = game.physics.p2.createCollisionGroup();
        this.treatCollisionGroup = game.physics.p2.createCollisionGroup();
        this.elementsCollisionGroup = game.physics.p2.createCollisionGroup();
        this.catCollidesWith
            = [this.wallsCollisionGroup,
                this.treatCollisionGroup,
                this.sensorCollisionGroup,
                this.fishCollisionGroup,
                this.elementsCollisionGroup];
    }
    return CollisionManager;
}());
exports.CollisionManager = CollisionManager;
