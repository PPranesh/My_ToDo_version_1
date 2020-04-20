const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

let day = "";
let wordDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "undefined"];

mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const todoItemsSchema = new mongoose.Schema({
    item: {
        type: String,
        required: [true, 'todo not entered!']
    }
});

const todoListSchema = new mongoose.Schema ({
    name: String,
    todoItemList: [todoItemsSchema]
});

const todoItems = mongoose.model("todos", todoItemsSchema);
const todoItemList = mongoose.model("todoItemList", todoListSchema);

app.get("/", function(req, res){

    day = date.gettingIndiaDate();   

    todoItems.find(function(error, todoList){
        if (error) {
            console.log(error);
        } else {
            res.render("lists", {itemTitle: day, newItem: todoList});        
        }
    });
});

function checkHomeDir (str1) {
    let end = 0;
    wordDay.forEach(function(dayyie){
        if (str1 === dayyie) {
            end = 1;
        }
    });

    if (end === 1) {
        return true;
    } else {
        return false;
    }
};

app.post("/", function(req, res){

    let todoItem = req.body.inputsTodos;
    let submitDirCheck = req.body.listType;

    let todo = new todoItems({
        item: todoItem,
    });

    if (checkHomeDir(submitDirCheck)) {
        
        todo.save();

        res.redirect("/");
    } else {

        todoItemList.findOne({name: submitDirCheck}, function(err, List){

            List.todoItemList.push(todo);
            List.save();

            res.redirect("/"+submitDirCheck);
        });
    }
});

app.post("/delete", function(req, res) {

    let checkId = req.body.check;
    
    todoItems.findByIdAndDelete({_id: checkId}, function(err){

        if (!err) {
            res.redirect("/");
        }
    });
});

const item1 = new todoItems({
    item: "My Dream Job"
});

const item2 = new todoItems({
    item: "My MacBook Air"
});

const item3 = new todoItems({
    item: "My Cycle"
});

const bulkData = [item1, item2, item3];

app.get("/:dirName", function(req, res) {

    let dirName = req.params.dirName;
    // let todoItem = req.body.inputsTodos;

    todoItemList.findOne({name: dirName}, function(error, item) {

        if (!error) {

            if (!item) {

                const itemLists = new todoItemList({
                    name: dirName,
                    todoItemList: bulkData
                });
                itemLists.save();

                res.redirect("/"+dirName);

            } else {
                res.render("lists", {itemTitle: item.name, newItem: item.todoItemList});
            }
        }
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server started!!");
});