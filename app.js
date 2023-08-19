const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStaringContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique aliquid nostrum porro exercitationem aperiam enim voluptatum delectus, ipsum voluptatem soluta molestias commodi nobis voluptatibus, molestiae facere recusandae cupiditate sunt ab";

const aboutContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione non nobis repudiandae in corporis animi dicta aspernatur, ut enim sequi nostrum? Officiis praesentium rerum excepturi ex nostrum, quia aperiam exercitationem?";

const contactContent = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione non nobis repudiandae in corporis animi dicta aspernatur, ut enim sequi nostrum? Officiis praesentium rerum excepturi ex nostrum, quia aperiam exercitationem?";

const app = express();
const port = 3000;


mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

const blogSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Blog = mongoose.model("Blog", blogSchema);

// let posts = [];

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/", async(req, res) => {
    try{
        const posts = await Blog.find({});
        // console.log(find);
        res.render("home.ejs", {
            startingContent : homeStaringContent,
            posts: posts
        });
    }
    catch(err){
        console.log(err);
    }
});

app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res)=>{
    res.render("contact", {contactContent: contactContent});
});

app.get("/compose", (req, res)=>{
    res.render("compose.ejs");
});

app.post("/compose", (req, res) => {
    try{
        // const post = {
        //     title :req.body.postTitle,
        //     content: req.body.postBody
        // }
        const post = new Blog({
            title : req.body.postTitle,
            content: req.body.postBody
        });
        post.save();
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
   
});

app.get("/posts/:postName", async(req, res) => {
    // const requestedTitle = _.lowerCase(req.params.postName);
    const requestedTitle = req.params.postName;
    // posts.forEach((post)=>{
    //     const storedTitle = _.lowerCase(post.title);

    //     if(requestedTitle == storedTitle){
            // res.render("post.ejs", {
            //     title: post.title,
            //     content: post.content
            // });
    //     }
    // });
    try{
        let findById = await Blog.findById(requestedTitle);
        // console.log(findById);
        res.render("post.ejs", {
            title: findById.title,
            content: findById.content
        });
    }
    catch(err){
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})