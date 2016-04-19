"use strict";
var GroupManager = (function () {
    function GroupManager(game) {
        this.rootGroup = game.add.group(undefined, 'root', false);
        this.catGroup = game.add.group(this.rootGroup, 'cat', false);
        this.elementGroup = game.add.group(this.rootGroup, 'element', false);
    }
    GroupManager.prototype.getAllGroups = function () {
        return [this.rootGroup, this.catGroup, this.elementGroup];
    };
    return GroupManager;
}());
exports.GroupManager = GroupManager;
