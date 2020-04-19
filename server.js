const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// let todoItems = ["My Dream Job", "My MacBook Air", "My Cycle"];
// let worktodoItems = [];

const todoItemsSchema = new mongoose.Schema({
    item: {
        type: String,
        required: [true, 'todo not entered!']
    },
    check: Boolean
});

const worktodoItemsSchema = new mongoose.Schema({
    item: {
        type: String,
        required: [true, 'todo not entered!']
    },
    check: Boolean
});

const todoItems = mongoose.model("todos", todoItemsSchema);
const worktodoItems = mongoose.model("workTodos", worktodoItemsSchema);

app.get("/", function(req, res){
    var day = date.gettingIndiaDate();   

    todoItems.find(function(error, todoList){
        if (error) {
            console.log(error);
        } else {
            res.render("lists", {itemTitle: day, newItem: todoList});        
        }
    });

    // res.render("lists", {itemTitle: day, newItem: todoItems});
});

app.post("/", function(req, res) {

    let todoItem = req.body.todos;

    if (req.body.buttonType === "clearButton") {

        // worktodoItems = [];
        // todoItems = [];
 
        res.redirect("/");

    } else {

        if (req.body.listType === "Work") {

            let todo = new worktodoItems({
                item: todoItem
            });
            todo.save();

            // worktodoItems.push(todo);
            res.redirect("/work");
        } else {

            let todo = new todoItems({
                item: todoItem,
            });
            todo.save();

            // todoItems.push(todo);
            res.redirect("/");
        }
    }

});

app.get("/work", function(req, res){

    worktodoItems.find(function(error, workTodoList){
        if (error) {
            console.log(error);
        } else {
            res.render("lists", {itemTitle: "Work", newItem: workTodoList});
        }
    });

    // res.render("lists", {itemTitle: "Work", newItem: worktodoItems});
});

app.post("/work", function(req, res){

    res.redirect("/work");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server started!!");
});