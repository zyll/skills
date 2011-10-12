var data = [{
    name: 'css',
    level: 2,
    root: true
},{
    name: 'javascript',
    level: 6,
    root: true,
}]
  , mongoose = require('mongoose')

  
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
    for(var i in data) {
        var skill = new Skill(data[i]);
        skill.save(function(err) {
            done++;
            if(done == data.length) {
                process.exit()
            }
        });
    }
});

