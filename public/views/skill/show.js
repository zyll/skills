var SkillView = Backbone.View.extend({

    tagName: 'li',

    events: {
        'click a.add:first': 'addSkill',
        'slidechange div.level': 'slideChange',
    },

    initialize: function() {
        _.bindAll(this, 'render', 'addSkill', 'slideChange');
        this.model.childs.bind('add', this.render);
    },

    slideChange: function(event, ui) {
        this.model.save({level: ui.value});
    },

    // @todo will be nice to add to the SkillStore
    addSkill: function(event) {
        event.preventDefault();
        this.model.childs.create({name: this.model.get('name') + ' child'});
    },

    render: function() {
        // level bar
        var sliderEl = $(this.make('div', {class :"level"}));
        sliderEl.slider({
            range: "min",
            value: this.model.get('level'),
            min: 0,
            max: 10
        });
        // add a skill element
        var addSkill = '<a href="#" class="add" title="ajouter dans la catégorie"> add </a>';

        // childs display, attached in order to not rebuild from scratch.
        this.childsView = this.childsView || new SkillsView({collection: this.model.childs});

        if(this.model.hasChild()) {
            var skilltitle = $(this.make(
                'label', {
                class: "skilltitle" ,
                for: this.model.get('name')}
                    , this.model.get('name')))
                .append(addSkill)
                .append(sliderEl);
                $(this.el).html(skilltitle)
                .append(this.make('input', {type: "checkbox", id: this.model.get('name')}));
        } else {
            var skilltitle = $(this.make('a', {href: "#", class: "file skilltitle"}, this.model.get('name')))
            .append(addSkill)
            .append(sliderEl);
            $(this.el).html(skilltitle);
        }
        $(this.el).append(this.childsView.render().el);

        return this;
    }

});
