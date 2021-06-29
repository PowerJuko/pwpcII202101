/* eslint-disable no-console */
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// eslint-disable-next-line import/no-unresolved
import winston from '@server/config/winston';

// Importando el Router principal
import router from '@server/routes/index';

// Importing configurations
// eslint-disable-next-line import/no-unresolved
import configTemplateEngine from '@s-config/template-engine';

// Webpack Modules
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevConfig from '../webpack.dev.config';

// Consultar el modo en que se esta ejecutando la aplicación
const env = process.env.NODE_ENV || 'development';

// Se crea la aplicación express
const app = express();

// Verificando el modo de ejecución de la aplicación
if (env === 'development') {
  console.log('> Excecuting in Development MOde: Webpack Hot Reloading');
  // PASO 1. Agregando la ruta del HMR
  // Reaload=true: Hanilita la reacarga del frontend cuando hay cambios en el codigo fueste del frontend
  // Timeout=1000: Tiempo de espera entre recarga y recarga de la página
  webpackDevConfig.entry = [
    'webpack-hot-middleware/client?reaload=true&timeout=1000',
    webpackDevConfig.entry,
  ];

  // Paso 2. Agregamos el plugin
  webpackDevConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  // Paso 3. Crear el compilador de webpack
  const compiler = webpack(webpackDevConfig);

  // Paso 4. Agregando el Middleware a la cadena de Middleware de nuestra aplicación
  app.use(
    WebpackDevMiddleware(compiler, {
      publicPath: webpackDevConfig.output.publicPath,
    })
  );

  // Paso 5. Agregando el Webpack Hot Middleware
  app.use(WebpackHotMiddleware(compiler));
} else {
  console.log('> Excecuting in Production Mode... ');
}

// view engine setup
configTemplateEngine(app);

app.use(morgan('dev', { stream: winston.stream })); // Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Instalando el enrutador principal a
// la aplicación express
router.addRoutes(app);

// catch 404 and forward to error handler
app.use((req, _res, next) => {
  // Log
  winston.error(
    `Code: 404, Message: Page Not Found, URL: ${req.originalurl}, Method: ${req.method}`
  );
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Loggeando con Winston
  winston.error(
    // eslint-disable-next-line no-undef
    `status: ${err.status || 500}, Message: ${error.message}, Method: ${
      req.method
    }, IP: ${req.ip}`
  );

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
