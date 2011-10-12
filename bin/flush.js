var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/skills');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Skill = mongoose.model('SkillSchema', new Schema({
    id    : ObjectId
  , name  : String
  , level : Number
  , root  : Boolean
  , childs: [Skill]
}));

mongoose.connection.on('open', function() {
    var done = 0;
    Skill.remove({}, function() {
        process.exit()
    })
});

