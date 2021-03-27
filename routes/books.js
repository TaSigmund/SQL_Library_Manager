var express = require('express');
var router = express.Router();
const models = require('../models');
const { Book } = models; //Book model
const {Op} = models.Sequelize; //Operators

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

/* GET books listing with pagination. */
router.get('/:page', asyncHandler(async (req, res)=> {
  let page = req.params.page;
  if (!isNaN(page)){
    let skipped= (page*5)-5; //defines the value for offset
    const books = await Book.findAll({ 
      offset: skipped, //defines how many entries get skipped
      limit: 5 //defines the max number of entries returned
    });
    const booksList = await books.map(books => books.toJSON());
    res.render('index', {books: booksList})
}
else {
  let error = new Error();
  error.status = 404;
  res.render('page-not-found', {error})
}
}))

/* POST form to search books*/
router.post('/', asyncHandler(async (req, res)=> {
  const books = await Book.findAll({
    where: { 
      [Op.or]:{
        title: {
          [Op.substring]: req.body.search
        },
        author: {
          [Op.substring]: req.body.search
        },
        genre: {
          [Op.substring]: req.body.search
        },
        year: {
          [Op.substring]: req.body.search
        }, 
      }
    }
  });
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
