$(document).ready(function() {

  window.App = {};

  App.SkillStore = new SkillStore();
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
