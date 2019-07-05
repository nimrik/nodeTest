var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Supp bro', condition: true, array: [1,2,3]});
});


module.exports = router;
