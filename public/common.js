// Add a name space for our app.
window.App = {};

// id mapping, data use mongodb format for id, tell it backbone to keep this in mind.
Backbone.Model.prototype.idAttribute = "_id";
