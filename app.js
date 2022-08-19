//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "This is by far my favorite of all the journaling ideas on this list. It’s also a crucial part of my morning routine, and something I’ve been doing daily for over five years. Every morning, I wake up, grab my journal, and re-write my goals. This is a daily practice for me—I’ll never miss a day for the rest of my life.Journaling my goals reminds me what matters most to me right now (when you do this, you’ll find that some of the goals you re-write will get more specific, while others will change or get forgotten about all together).Something magical happens when you regularly write down what you really, truly, genuinely want in life—you actually start to get it. Great ideas hit you out of nowhere, and your mind urges you to take action on them until your goals become a reality. It’s a beautiful thing.";
const aboutContent = "The fact that content drives the Internet is nothing new, though today, there is a greater emphasis on the importance of quality. Internet marketers can no longer rely on publishing enormous amounts of thin content on online magazines, low-quality blogs, and article directories to build links and drive traffic to their main websites. As search engine giant Google seeks to increase the overall quality of the material on the Internet by rewarding well-researched and error-free content and penalizing sites who manipulative SEO strategies, content marketers need to start shifting their focuses to quality.";
const contactContent = "Contact is an open access, peer reviewed international journal that acts as a focal point for all research into intracellular contacts, their lipidology, ion signaling and membrane traffic."

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true});

const postSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Post = mongoose.model("Post",postSchema);


app.get("/",function(req,res){

  Post.find({},function(err,posts){
    res.render("home",{
      startingcontent:homeStartingContent,
      posts:posts
  });

  });

});

app.get("/compose",function(req,res){
  res.render("compose")
});

app.post("/compose",function(req,res){
  const post = new Post({
    title : req.body.postTitle,
    content : req.body.postBody
  });

  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId",function(req,res){

  const requestedPostId = req.params.postId;

   Post.findOne({_id:requestedPostId},function(err,post){
     res.render("post",{
       title:post.title,
       content:post.content
   });
  });

});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent})
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent})
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
