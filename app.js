const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


mongoose.connect('mongodb://localhost:27017/ToDoDb', {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name:String
};
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"Welcome to your To-Do List"
});
const item2 = new Item({
  name:"Click + to add new ToDo"
});
const item3 = new Item({
  name:"<--Hit this to delete ToDo"
});
const defaultitems = [item1,item2,item3];

const ListSchema = {
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("List",ListSchema)

app.get('/', function(req, res){
  Item.find({},function(err,founditems){
      if(founditems.length === 0){
        Item.insertMany(defaultitems,function(err){
          if(err){
            console.log(err);
          }else{
            console.log("Successfully added the default items");
          }
        })
        res.redirect('/');
      }else{
        res.render("list",{Listtitle:"Today",newListItems:founditems});
      }
  });
});

app.post('/',function(req,res){
  const itemname = req.body.newItem;
  const item = new Item({
    name:itemname
  })
  item.save();
  res.redirect('/');
});

app.post('/delete',function(req,res){
  const checkeditemID = req.body.checkbox;
  Item.findByIdAndRemove(checkeditemID,function(err){
    if(!err){
      console.log("Deleted checked item successfully");
      res.redirect('/');
    }
  });
});

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;

});

app.listen(3000,function(req,res){
  console.log('Server is listening');
});
