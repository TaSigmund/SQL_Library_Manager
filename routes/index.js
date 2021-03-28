var express = require('express');
var router = express.Router();

//import models
/* GET '/' and redirect to '/books' */
router.get('/', async function(req, res, next) {
  res.redirect('/books/page/1')
});

module.exports = router;
