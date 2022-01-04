import dotenv from 'dotenv'
import path from 'path'
import express from 'express';
import helmet from 'helmet'
import cors from 'cors'
import ejs from 'ejs'
import morgan from 'morgan'
import {engine} from 'express-handlebars'
import logger from './middlewares/logger.js'
import router from './components/index.js'
import db from './config/db.js'
import { ErrorHandler } from './helpers/globalHandler.js'
const PORT = process.env.PORT || 9000;
const __dirname = path.resolve()
const app = express();
dotenv.config()


db
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/views`));
app.use(express.json());
app.use(helmet())
app.use(morgan('dev'))
app.engine('hbs', engine({extname:'.hbs'}))
app.set('view engine', 'hbs')
app.use('/api/v1/', router)
app.all('*', (req, res) =>{
  throw new ErrorHandler(404, `Requested URL ${req.path} not found`)
   // res.status(404).json({
   //    success:0,
   //    message:err.message
   // })
})
app.use((err, req, res, next) => {
   // handleError(err, res);
   const statusCode = err.statusCode ||500
   res.status(statusCode).json({
      success: false,
      reslut:0,
      message:err.message
   })
 });
app.listen(PORT, () => {
   logger.info(`Server started at port:${PORT}`)
})