var SkillsView = Backbone.View.extend({

    tagName: 'ol',

    initialize: function() {
        _.bindAll(this, 'render', 'addRow');
    },

    render: function() {
        this.collection.each(this.addRow);
        return this;
    },

    addRow: function(skill) {
        var row = new SkillView({model: skill});
        $(this.el).append(row.render().el);
    }
});
