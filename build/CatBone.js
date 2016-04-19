var EPSILON = 0.01;
var CATFORCE = 0.01;
var CatBone = (function () {
    function CatBone(anchor, endPoint) {
        this.rotateDir = -1;
    }
    CatBone.prototype.getRotationVector = function () {
        var dest;
        var end = this.getEndPoint();
        if (this.rotateDir = -1) {
            dest = new Vector(end.x, -end.y).normalize();
        }
        else {
            dest = new Vector(-end.x, end.y).normalize();
        }
        return dest;
    };
    CatBone.prototype.getEndPoint = function () {
        return new Point(this.origin.x + this.vector.x, this.origin.y + this.vector.y);
    };
    CatBone.prototype.getForceVector = function (target) {
        var end = this.getEndPoint();
        var angle = Math.atan2(end.y - target.y, end.x - target.x);
        var dist = end.distance(target);
        var force = new Vector(Math.cos(angle) * dist, Math.sin(angle) * dist);
        return force;
    };
    CatBone.prototype.getRotationForce = function (target) {
        var rotate = this.getRotationVector();
        var force = this.getForceVector(target);
        var angle = rotate.getAngle(force);
        var dot = rotate.dot(force);
        if (dot <= EPSILON) {
            return new Vector(0, 0);
        }
    };
    CatBone.prototype.addRotationForce = function (force) {
    };
    return CatBone;
}());
