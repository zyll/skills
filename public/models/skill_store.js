/**
* Used to acces skills from raw data.
*/
var SkillStore = function(tree) {
    this._collection = {}; // id / data
    this._index = []; // all ids
    if(tree && _.isArray(tree)) this.initialize(tree);
}

SkillStore.prototype.initialize = function(tree) {
    _.each(tree, this.add, this);
}

SkillStore.prototype.add = function(data) {
    // prepare indexed access
    this._index.push(data._id);
    this._collection[data._id] = data;
}

// return skill(s) data from an id or an id's array.
SkillStore.prototype.get = function(ids) {
    if(_.isArray(ids)) {
        return _.map(ids, this.get, this);  
    } else{
        return this._collection[ids];
    }
},

// return based skills (the one marked as root)
SkillStore.prototype.roots = function() {
    var self = this
    , roots = [];
    _.each(this._index, function(id) {
        var  data = self.get(id);
        if(data.root) roots.push(data);
    });
    return roots;
}

// fetch data from server.
// return a Jquery deffer.
SkillStore.prototype.fetch = function() {
    return  $.get('/skills', 'json');
}
