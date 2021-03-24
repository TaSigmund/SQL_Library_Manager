var express = require('express');
var router = express.Router();
const models = require('../models');
const { Book } = models;

/* GET users listing. */
router.get('/', async (req, res, next)=> {
  try {
    const books = await Book.findAll();
    const booksList = await books.map(books => books.toJSON())
    res.render('index', {books: booksList})
  }
  catch(error){
    console.error('Error connecting to the database: ', error);
  }
});

router.get('/new', (req, res, next) => {
  res.render('new')
}) 

module.exports = router;
