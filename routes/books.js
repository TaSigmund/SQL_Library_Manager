var express = require('express');
var router = express.Router();
const models = require('../models');
const { Book } = models;

/*ASYNC HANDLER*/
function asyncHandler(cb){
  return async(req , res , next) => {
    try {await cb(req,res,next)}
    catch (error) {
      if(error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        if(req.path === "/new"){
          res.render("new-book", {error})
        } else
        {
          res.render("book-details", {book, error})
        }
      }
      else {
        res.status(500).send(error)
      }
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res)=> {
    const books = await Book.findAll();
    const booksList = await books.map(books => books.toJSON())
    res.render('index', {books: booksList})
}));

/* GET form to create a new book. */

router.get('/new', (req, res, next) => {
  res.render('new-book')
}) 

/* POST data to add a new book */
router.post('/new', asyncHandler(async (req, res, next) => {
    parseInt(req.body.year);
    const book = await Book.create(req.body);
    res.redirect('/books');
})) 

/* GET book details */

router.get('/:id', async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  res.render('book-details', {book})
}) 

/* POST data to update a book entry */
router.post('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books');
})) 

/* POST data to delete a book entry */
router.post('/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
})) 

module.exports = router;
