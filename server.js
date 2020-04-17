const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let todoItems = ["My Dream Job", "My MacBook Air", "My Cycle"];
let worktodoItems = [];

app.get("/", function(req, res){
    var day = date.gettingIndiaDate();

    res.render("lists", {itemTitle: day, newItem: todoItems});
});

app.post("/", function(req, res) {

    let todo = req.body.todos;

    if (req.body.buttonType === "clearButton") {

        worktodoItems = [];
        todoItems = [];

        res.redirect("/");

    } else {

        if (req.body.listType === "Work") {
            worktodoItems.push(todo);
            res.redirect("/work");
        } else {
            todoItems.push(todo);
            res.redirect("/");
        }
    }

});

app.get("/work", function(req, res){
    res.render("lists", {itemTitle: "Work", newItem: worktodoItems});
});

app.post("/work", function(req, res){
    res.redirect("/work");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server started!!");
});