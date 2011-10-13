$(document).ready(function() {

  // root skills collection from flatten skills data.

  $.when(App.SkillStore.fetch())
    .then( function(data) {
        App.SkillStore.initialize(data);
        var skills = new Skills(App.SkillStore.roots());
        var v = new SkillsView({
           el: $("#skills"),
           collection: skills});
        v.render();
    })

});

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

  // fixme
  // Singleton to easy access. Not really a good solution, but a quick one.
  var App = {};
  App.SkillStore = new SkillStore();
  /*App.SkillStore = new SkillStore([{
        _id: 1,
        name: 'css',
        level: 2,
        childs: [],
        root: true
    },{
        _id: 2,
        name: 'javascript',
        level: 6,
        root: true,
        childs: [3, 4]
    },{
        _id: 3,
        name: 'node',
        level: 4,
        root: false,
        childs: []
    },{
        _id: 4,
        name: 'backbone',
        level: 2,
        root: false,
        childs: []
    }]);
  */

  Backbone.Model.prototype.idAttribute = "_id";
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
