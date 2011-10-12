// Required system libraries
var http    = require('http')
  , jade    = require('jade')
  , express = require('express')
  , mongoose = require('mongoose')
  , sys = require('util')
  , assets = {
      js: require('./assets/js')
  };
  require('./assets/app_boot').forEach(function(it) {
      assets.js.push(it)
  });
  console.log(assets)

var sessionStore = require("connect-mongoose")(express);
mongoose.connect('mongodb://localhost/skills');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Skill = mongoose.model('SkillSchema', new Schema({
    id    : ObjectId
  , name  : String
  , level : Number
  , childs: [Skill]
}));

mongoose.connection.on('open', function() {
var server = express.createServer(
    express.static(__dirname + '/public')
  , express.logger()
  , express.bodyParser()
  , express.cookieParser()
  , express.methodOverride()
  , express.session({
        secret : "secret",
        store : new sessionStore()})
  , express.router(function(app) {

      app.put('/skill/:id', function(req, res, next) {
          Skill.findById(req.params.id, function(err, doc) {
              if(err) {
                  send(404)
              } else {
                  if(doc.user != req.session.user.id)
                  doc.set(req.body)
                    .save(function(err) {
                      res.send(err ? 404 : doc)
                    })
              }
          })
      });

      app.del('/skill/:id', function(req, res, next) {
          Skill.findById(req.params.id, function(err, doc) {
              if(err) {
                res.send(404);
              } else {
                doc.remove(function(err) {
                  res.send(err ? 404 : 204)
                })
              }
          });
      });

      app.get('/skills', function(req, res, next) {
          Skill.find({}, function(err, docs) {
            res.send(err ? 404 : docs)
          });
      });

      app.get('/skill/:id', function(req, res, next) {
          res.send(Project.findById(req.params.id), function(err, doc) {
              if(err) {
                res.send(404)
              } else {
                res.send(doc)
              }
          });
      });

      app.get('/', function(req, res, next) {
          res.render('index.jade', {layout: false, locals: {assets: assets}})
      });

    })

)

server.set('view engine', 'jade')

server.error(function(err, req, res) {
    console.log(err.stack)
    res.send(err.stack, 500)
});

server.listen(3011, function() {console.log('Listening on http://127.0.0.1:3011')});
})
