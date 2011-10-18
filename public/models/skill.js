
var Skill = Backbone.Model.extend({

    defaults: {
        name: null,
        level: 0,
        root: false,
        childs: []
    },

    url: function() {
        var url = "/skill/";
        if(this.id) {
            url += this.id;
        }
        return url;
    },

    initialize: function() {
        // collect childs data from SkillStore
        var skills = this.get('childs').map(App.SkillStore.get, App.SkillStore);
        // handle them has a BB collection.
        this.childs = new Skills(skills);
        this.childs.bind('add', this.syncChildsData, this);
    },

    syncChildsData: function(skill) {
        var childs = this.get('childs');
        childs.push(skill.id);
        this.save({childs: childs}, {silent: true});
    },

    hasChild: function() {
        return this.childs.length > 0;
    }

});

var Skills = Backbone.Collection.extend({
    model: Skill
});
