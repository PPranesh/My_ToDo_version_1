const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const todoItems = ["My Dream Job", "My MacBook Air", "My Cycle"];
const worktodoItems = [];

app.get("/", function(req, res){
    
    var day = date.getDay()+", "+date.getDate();
    
    res.render("lists", {itemTitle: day, newItem: todoItems});
});

app.post("/", function(req, res) {

    let todo = req.body.todos;

    if (req.body.listType === "Work") {
        worktodoItems.push(todo);
        res.redirect("/work");
    } else {
        todoItems.push(todo);
        res.redirect("/");
    }
});

app.get("/work", function(req, res){
    res.render("lists", {itemTitle: "Work To-Do", newItem: worktodoItems});
});
    
app.post("/work", function(req, res){
    res.redirect("/work");
});

app.listen(3000, function(){
    console.log("server started!! runs on port 3000");
});