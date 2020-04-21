const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

mongoose.connect("mongodb+srv://admin-pranesh:doItIfYouCan%40%2B2020@cluster0-cctsm.mongodb.net/todoListDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.set("view engine", "ejs");

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const todoItemsSchema = new mongoose.Schema({
    item: String
});

const todoListSchema = new mongoose.Schema ({
    name: String,
    todoList: [todoItemsSchema]
});

const items = mongoose.model("todos", todoItemsSchema);
const Lists = mongoose.model("todoList", todoListSchema);

app.get("/", function(req, res){   

    items.find(function(error, todo){
        if (!error) {
            res.render("lists", {itemTitle: "TODO", newItem: todo});        
        }
    });
});

app.post("/", function(req, res){

    let todo = req.body.inputTodos;
    let headingCheck = req.body.listHeading;

    let todos = new items({
        item: todo
    });

    if (headingCheck === "TODO") {
        
        todos.save();

        res.redirect("/");
    } else {

        Lists.findOne({name: headingCheck}, function(err, returnList){

            if (!err) {
                
                returnList.todoList.push(todos);
                returnList.save();

                res.redirect("/"+headingCheck);
            }
        });
    }
});

app.post("/delete", function(req, res) {

    let checkId = req.body.getId;    
    let deleteTitle = req.body.getTitle;

    if (deleteTitle === "TODO") {
        items.findByIdAndRemove({_id: checkId}, function(err, arr){

            if (!err) {
                res.redirect("/");
            }
        });
    } else {

        Lists.findOneAndUpdate({ name: deleteTitle}, {$pull: {todoList: {_id: checkId}}},function(err, list){

            if (!err) {
                res.redirect("/"+deleteTitle);   
            }
        });
    }
});

const item1 = new items({
    item: "My Dream Job"
});

const item2 = new items({
    item: "My MacBook Air"
});

const item3 = new items({
    item: "My Cycle"
});

const empty = new items({
    item: ""
});

const bulkData = [item1, item2, item3];

app.get("/:dirName", function(req, res) {

    let newListName = _.capitalize(req.params.dirName);

    Lists.findOne({name: newListName}, function(error, newItem) {

        if (!error) {

            if (!newItem) {
                    
                if (newListName === "Favicon.ico") {
                    
                    res.redirect("/");

                } else {
                    const itemLists = new Lists({
                        name: newListName,
                        todoList: []
                    });
                    itemLists.save();
    
                    res.redirect("/"+newListName);
                }

                
            } else {
                res.render("lists", {itemTitle: newItem.name, newItem: newItem.todoList});
            }
        }
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server started!!");
});