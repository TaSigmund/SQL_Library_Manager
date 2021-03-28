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
        next(error)
      }
    }
  }
}

/* GET books listing with pagination. */
router.get('/page/:page', asyncHandler(async (req, res, next)=> {
  let page = req.params.page;
  if (!isNaN(page)){
    let skipped= (page*5)-5; //defines the value for offset
    const books = await Book.findAll({ 
      offset: skipped, //defines how many entries get skipped
      limit: 5 //defines the max number of entries returned
    });
  const booksList = await books.map(books => books.toJSON());//books to display on the page
  const numberOfBooks = await Book.count(); //total number of Books
  const pages = await Math.ceil(numberOfBooks/5);//number of pages
  res.locals.pages = pages;
  res.locals.page = parseInt(page);//needs to be a number so we can do calculations in the pug view
    if(page>pages) {
      next()
    }
    else{
    res.render('index', {books: booksList})
    }
}
else {
  next()
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
  if (!isNaN(req.params.id)){ //makes sure there is an id to match
    const book = await Book.findByPk(req.params.id);
    if (!book){ //renders 404 if the user pastes in a url with an id that doesn't exist
      next()
    }
    else {
    res.render('book-details', {book})}}
  else {
    next()
  }
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

 /* 404 error that then gets passed to the global error handler */
 router.use((req, res, next)=>{
  const err = new Error();
  err.status = 404;
  err.message = 'The page you are looking for does not exist.'
  next(err);
})

/*** 
global error handler 
***/
router.use((err, req, res, next) => {
  if (!err.status) {err.status = 500}; //sets a status if necessary
  if (!err.message) {err.message = 'A server error has occured'}; //sets an error message if necessary
  
  /* the following lines render the appropriate views */
  if (err.status === 404) {
      res.render('page-not-found', { error: err })
  }
  else {
      res.render('error', { error: err })
  }
}
)

module.exports = router;
