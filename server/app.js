import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import winston from 'winston';

import indexRouter from '@s-routes/index';
import usersRouter from '@s-routes/users';

//Importing configurations
import configTemplateEngine from '@s-config/template-engine'

//Webpack Modules
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import WebpackConfig from '../webpack.dev.config';
import webpackDevConfig from '../webpack.dev.config';

//consultar el modo en que se esta ejecutando la aplicación
const env = process.env.NODE_ENV || 'development';

//se crea la aplicación express
var app = express();

//Verificando el modo de ejecución de la aplicación
if(env === 'development'){
  console.log('> Excecuting in Development MOde: Webpack Hot Reloading');
  //PASO 1. Agregando la ruta del HMR
  //reaload=true: Hanilita la reacarga del frontend cuando hay cambios en el codigo fueste del frontend
  //timeout=1000: Tiempo de espera entre recarga y recarga de la página
  WebpackConfig.entry = ['webpack-hot-middleware/client?reaload=true&timeout=1000', WebpackConfig.entry]

  //Paso 2. Agregamos el plugin
  WebpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  //Paso 3. Crear el compilador de webpack
  const compiler = webpack(WebpackConfig);

  //Paso 4. Agregando el Middleware a la cadena de Middleware de nuestra aplicación
  app.use(WebpackDevMiddleware(compiler,{
    publicPath: webpackDevConfig.output.publicPath
  }));

  //Paso 5. Agregando el Webpack Hot Middleware
  app.use(WebpackHotMiddleware(compiler));
}else{
  console.log('> Excecuting in Production Mode... ');
}

// view engine setup
configTemplateEngine(app);

app.use(morgan('combined',{ stream : winston.stream })); //middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'..', 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
