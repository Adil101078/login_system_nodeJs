import dotenv from 'dotenv'
import path from 'path'
import express from 'express';
import passport from 'passport'
import mongoose from 'mongoose';
import helmet from 'helmet'
import cors from 'cors'
import router from './components/index.js'
import './auth/passportConfig.js'
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


//Routes

app.use('/api/v1/', router)







app.listen(PORT, () => {
    console.log(`Server started at port:${PORT}`)
})