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
    }
});

const todoListSchema = new mongoose.Schema ({
    _id: String,
    todoItemList: todoItemsSchema
});

const todoItems = mongoose.model("todos", todoItemsSchema);
const todoItemList = mongoose.model("todoItemList", todoListSchema);

app.get("/", function(req, res){

    var day = date.gettingIndiaDate();   

    todoItems.find(function(error, todoList){
        if (error) {
            console.log(error);
        } else {
            res.render("lists", {itemTitle: day, newItem: todoList});        
        }
    });
    
});

app.post("/", function(req, res){

    let todoItem = req.body.inputsTodos;

    let todo = new todoItems({
        item: todoItem,
    });
    todo.save();

    // todoItems.push(todo);
    res.redirect("/");

});

app.post("/delete", function(req, res) {

    let checkId = req.body.check;
    
    todoItems.findByIdAndDelete({_id: checkId}, function(err){

        if (!err) {
            res.redirect("/");
        }

    });


});


app.get("/:dirName", function(req, res) {

    // let todoItem = req.body.inputsTodos;

    let dirName = req.params.dirName;

    // const item = new todoItems({
    //     item: todoItem
    // });
    // item.save();

    // const itemLists = new todoItemList({
    //     _id: dirName,
    //     todoItemList: item
    // });

    // itemLists.save();
    
    res.render("lists", {itemTitle: dirName, newItem: []});


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