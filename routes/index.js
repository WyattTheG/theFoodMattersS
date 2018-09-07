var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let db = mongoose.connection;
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var btoa = require('btoa');


var Item = require('../models/item');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TheFoodMattersInventorySystem' });
});

/* GET error page. */
router.get('/error', function(req, res, next) {
  res.render('error', { title: 'TheFoodMattersS' });
});

/* GET signin page. */
router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'TheFoodMattersS/signin' });
});


/* Function for convertedImageData*/
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.toString().replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

/*GET Item by id*/
router.get('/item/:itemId', function (req, res, next) {
    //var successMsg = req.flash('success')[0];
    Item.findById(req.params.itemId, function(err, item) {
       if (err) {
           return console.log(err);;
       }
       var theItem = item;
       var imageData = item.img.data;
       console.log(imageData);
       //convertedImageData = 'data:image/jpeg;base64,' + hexToBase64(imageData);

       // encode the file as a base64 string.
       var convertedImageData = imageData.toString('base64');
       console.log(convertedImageData);

       // define your new document
       res.render('item', {title: 'theFoodMattersWebsite', item: theItem, base64Data: convertedImageData});
    });
});

/* GET addItem page. */
router.get('/addItem', function(req, res, next) {
  res.render('addItem', { title: 'TheFoodMattersS/addItem' });
});

/* GET inventory page. */
router.get('/inventory', function(req, res, next) {
  Item.find(function (err, docs) {
        var itemChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            itemChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('inventory', {title: 'theFoodMattersWebsite', items: itemChunks});
    });
});


const multerConfig = {

storage: multer.diskStorage({
 //Setup where the user's file will go
 destination: function(req, file, next){
   next(null, 'public/images/itemImages/allInventory');
   },

    //Then give the file a unique name
    filename: function(req, file, next){
        console.log(file);
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        next(null, file.originalname);
      }
    }),

    //A means of ensuring only images are uploaded.
    fileFilter: function(req, file, next){
          if(!file){
            next();
          }
        const image = file.mimetype.startsWith('image/');
        if(image){
          console.log('photo uploaded');
          next(null, true);
        }else{
          console.log("file not supported");

          //TODO:  A better message response to user on failure.
          return next();
        }
    }
  };

/*POST Item to datatbase GOOD CODE*/

router.post('/addItem', multer(multerConfig).single('photo'),function(req, res){
    var itemName = req.body.name;
    console.log(itemName);
    console.log(req.body.name);
    console.log(req.body.fileName);
    console.log(req.body.name);
    var theFile = req.body.fileName;
    console.log(theFile);
    var path = 'public/images/itemImages/allInventory/' + theFile;
    console.log(path);
    var item = new Item();
    item.name = req.body.name,
    item.description = req.body.description,
    item.dimensions = req.body.dimensions,
    item.color = req.body.color,
    item.numberOf = req.body. numberOf,
    item.location = req.body.location,
    item.notes = null,
    item.quantityForEvent = null,
    item.available = true;

    console.log(item);
    //item.img.data = fs.readFileSync(path),
    item.img.contentType = 'image/png'

    // read the img file from tmp in-memory location
    var newImg = fs.readFileSync(path);
    // encode the file as a base64 string.
    var encImg = newImg.toString('base64');
    // define your new document

    console.log(item);

    item.img.data = encImg,
    //item.img.contentType = 'image/png',


    db.collection('items').insertOne(item, (err, result) => {
      if (err) return console.log(err);
      console.log('saved to database');
      fs.unlink(path, (err) => {
        if (err){ throw err;}
        console.log(path + ' was deleted');
      });
    });
    res.redirect('/inventory');
});


router.get('/searchResults', function(req, res, next) {
  var searchString = req.query.searchString;
  console.log(searchString);

  Item.find({$or:[{name: {$regex : searchString, '$options' : 'i'}},{description: {$regex : searchString, '$options' : 'i'}},{color: {$regex : searchString, '$options' : 'i'}}]}, function (err, docs) {
      var itemsArray = [];
      if(err) {
          console.log(err);
      }
      for (var i = 0; i < docs.length; i++) {
          itemsArray.push(docs[i]);
      }
      if(itemsArray == null){
        console.log('No Items With this name found')
      }
      console.log('itemsArray:' + itemsArray);
      res.render('searchResults', {title: 'theFoodMattersWebsite', searchResults: itemsArray});

    })
});












module.exports = router;
