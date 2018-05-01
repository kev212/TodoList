var express               = require('express'),
    mongoose              = require('mongoose'),
    bodyParser            = require('body-parser'),
    passport              = require('passport'),
    User                  = require('./models/user'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    app                   = express();

// mongoose.connect('mongodb://localhost/todolist');
mongoose.connect('mongodb://pierce212:123@ds163769.mlab.com:63769/todolist');
app.use(require("express-session")({
  secret : "tes",
  resave : false,
  saveUnitiliazed : false
}));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to the database");
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
})

app.get("/", isLoggedIn_ ,function(req, res){
  res.render("index");
});

// app.get("/login", function(req, res){
//   res.render("l");
// });

app.post("/login", passport.authenticate("local", {
  successRedirect: "/todos",
  failureRedirect: "/"
}), function(req, res){
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  User.register(new User({
    name    : req.body.name,
    username: req.body.username
    }), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/todos");
    });
  });
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
})

app.get("/todos", isLoggedIn ,function(req, res){
  User.findOne({username: req.user.username}, function(err, alltodos){
    if(err){
      console.log(err);
    } else {
      res.render("todos", { todos : alltodos, curentUser : req.user });
    }
  });
});

app.post("/addTodo", function(req, res){
  var activity = req.body.activity;
  User.findOne({username: req.user.username}, function(err, user){
    if(err){
      console.log(err);
    } else {
      user.activity.push(activity);
      user.save(function(err, save){
        if(err){
          console.log(err);
        } else {
          console.log(save);
        }
      });
    }
  })
  res.redirect("/todos");
});

app.post("/remove", function(req, res){
  var activity = req.body.activity;
  User.findOne({username: req.user.username}, function(err, user){
    if(err){
      console.log(err);
    } else {
      user.activity.pull(activity);
      user.save(function(err, save){
        if(err){
          console.log(err);
        } else {
          console.log(save);
        }
      });
    }
  });

  // User.findOne({username : req.user.username}, function(err, user){
  //   if(err) {
  //     console.log(err);
  //   } else {
  //     user.remove({activity : })
  //   }
  // })
  // Todo.remove({ activity : activity }, function(err, todo) {
  //   if(err){
  //     console.log(err);
  //   } else {
  //     console.log(todo);
  //   }
  // });
  res.redirect("/todos");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

function isLoggedIn_(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect("/todos");
  }
  next();
}

app.listen(3000, console.log("Server Started!"));
