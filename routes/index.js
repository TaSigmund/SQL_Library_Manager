var express = require('express');
var router = express.Router();

//import models

const models = ('../models');
const { Book } = models;


/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
  const books = await Book.findAll({attributes: ['id']});
    console.log(books => books.toJSON())
  }
  catch(error){
    console.error('Error connecting to the database: ', error);
  }
  //res.render('index', { title: 'Express' });
});

module.exports = router;
