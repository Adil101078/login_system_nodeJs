import dotenv from 'dotenv'
import path from 'path'
import express from 'express';
import passport from 'passport'
import mongoose from 'mongoose';
import helmet from 'helmet'
import cors from 'cors'
import router from './components/index.js'
import AppError from './utils/appError.js'
import globalErrorHandler from './helpers/globalErrorHandler.js'
dotenv.config()
const PORT = process.env.PORT || 9000;
const app = express();
const __dirname = path.resolve()






// Database Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then( () => { console.log('Connected to Database') },
       err => { console.log(err) }
  );

//Middlewares
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(passport.initialize());
app.use(helmet())
app.use(cors())
app.use(globalErrorHandler)


//Routes

app.use('/api/v1/', router)

//Error handling for all routes
// app.all('*',(req, res, next) => {
//      next(new AppError(`Can't find ${req.originalUrl} on this server`, 400))
// })








app.listen(PORT, () => {
    console.log(`Server started at port:${PORT}`)
})