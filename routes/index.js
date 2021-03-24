var express = require('express');
var router = express.Router();

//import models

const models = require('../models');
const { Book } = models;


/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const books = await Book.findAll();
    console.log(books => books.toJSON());
    res.json(books);
  }
  catch(error){
    console.error('Error connecting to the database: ', error);
  }
  //res.render('index', { title: 'Express' });
});

module.exports = router;
