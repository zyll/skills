$(document).ready(function() {
  var tree = [
      {
        name: 'css',
        level: 2,
        childs: []
      },{
          name: 'javascript',
          level: 6,
          childs: [
              {
                name: 'node',
                level: 4,
                childs: []
              },{
                name: 'backbone',
                level: 2,
                childs: []
              }
          ]
      }
  ];

  var skills = new Skills(tree);
  var v = new SkillsView({
      el: $("#skills"),
      collection: skills});
  v.render();

});


  var Skill = Backbone.Model.extend({

    defaults: {
      name: null,
      level: 0,
      childs: []
    },

    initialize: function() {
      this.childs = new Skills(this.get('childs'), {parentSkill: this.model});
    },

    hasChild: function() {
        return this.childs.length > 0;
    }

  });

  var SkillView = Backbone.View.extend({

    tagName: 'li',

    events: {
        'click a.add:first': 'addSkill'
    },

    initialize: function() {
        _.bindAll(this, 'render', 'addSkill');
        this.model.childs.bind('add', this.render);
    },

    addSkill: function(event) {
        event.preventDefault();
        this.model.childs.add(new Skill({name: this.model.get('name') + '_child'}));
    },

    render: function() {
        // level bar
        var sliderEl = $('<div class="level"></div>');
        sliderEl.slider({
            range: "min",
            value: this.model.get('level'),
            min: 0,
            max: 10
        });
        // add a skill element
        var addSkill = '<a href="#" class="add" title="ajouter dans la catégorie"> + </a>';

        // keep a link on childsView
        this.childsView = this.childsView || new SkillsView({collection: this.model.childs});

      if(this.model.hasChild()) {
        var skilltitle = $('<label class="skilltitle" for="'+this.model.get('name')+'">'+this.model.get('name')+'</label>')
          .append(addSkill)
          .append(sliderEl);
        $(this.el).html(skilltitle)
          .append('<input type="checkbox" id="'+this.model.get('name')+'"/>');
      } else {
        var skilltitle = $('<a href="" class="file skilltitle">'+this.model.get('name')+'</a>')
          .append(addSkill)
          .append(sliderEl);
        $(this.el).html(skilltitle);
      }
      $(this.el).append(this.childsView.render().el);

      return this;
    }

  });

  var Skills = Backbone.Collection.extend({
    model: Skill
  });

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

