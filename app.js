//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const url = "mongodb+srv://kanak:Kanak@fruitlist.mtwxoeq.mongodb.net/postDB?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);
mongoose.connect(url, {useNewUrlParser: true}, err=>{
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to mongoDB atlas");
  }
});

const contentSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Content = new mongoose.model("Content", contentSchema);

const postSchema = new mongoose.Schema ({
  title: String,
  content: String
});

const Post = new mongoose.model("Post", postSchema);

const homeStartingContent = new Content ({
  title: "Home",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

const aboutContent = new Content ({
  title: "About",
  content: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});

const contactContent = new Content ({
  title: "Contact",
  content: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});

const contentArray = [homeStartingContent, aboutContent, contactContent];

app.get("/", (req, res)=>{
  Content.find({}, (err, content)=>{
    if (err) {
      console.log(err);
    }
    if (content.length === 0) {
      Content.insertMany (contentArray, err=>{
        if (err) {
          console.log(err);
        } else {
          console.log("Content Inserted");
        }
      });
      res.redirect("/");
    } else {
      Post.find({}, (err, post)=>{
        if (err) {
          console.log(err);
        }
        if (post.length === 0) {
          res.render("home", {
            startingContent: content[0],
            posts: []
          });
        } else {
          res.render("home", {
            startingContent: content[0],
            posts: post
          });
        }
      });
    }
  });
});

app.get("/about", function(req, res){
  Content.findOne({title: "About"}, (err, content)=>{
    if (err) {
      console.log(err);
    } else {
      res.render("about", {aboutContent: content});
    }
  });
});

app.get("/contact", function(req, res){
  Content.findOne({title: "Contact"}, (err, content)=>{
    if (err) {
      console.log(err);
    } else {
      res.render("contact", {contactContent: content});
    }
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const newPost = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  newPost.save();

  res.redirect("/");
});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = req.params.postName;

  var posts = [Post];

  Post.findOne({title: requestedTitle}, (err, post)=>{
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});