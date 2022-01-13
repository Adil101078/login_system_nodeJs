import path from 'path'
import express from 'express';
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import logger from './middlewares/logger.js'
import router from './components/index.js'
import { config } from 'dotenv'
import { engine } from 'express-handlebars'
import { ErrorHandler } from './helpers/globalHandler.js'
config()
const PORT = process.env.PORT || 9000;
const __dirname = path.resolve()
const app = express()


app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/views`));
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.engine('hbs', engine({extname:'.hbs'}))
app.set('view engine', 'hbs')
app.use('/api/v1/', router)
app.all('*', (req, res) =>{
  throw new ErrorHandler(404, `Requested URL ${req.path} not found`)
})
app.use((err, req, res, next) => {
   const statusCode = err.statusCode || 500
   res.status(statusCode).json({
      success: false,
      reslut:0,
      message:err.message
   })
 })
app.listen(PORT, () => {
   logger.info(`Server started at port:${PORT}`)
})