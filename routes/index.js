var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', author: 'Bernardo Calderón' });
});

//Agregando nueva ruta
router.get('/greeting', function(req,res, next){
  //res.send('Hola Campeon de la Fullstack Web')
  res.status(200).json({message: 'Hola Campeon de la Fullstack Web'})
})

router.get('/test', function(req,res, next){
  res.send('Hola soy Calderón García Julio Bernardo')
})
module.exports = router;
