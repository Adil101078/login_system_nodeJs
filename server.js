import dotenv from 'dotenv'
import path from 'path'
import express from 'express';
import passport from 'passport'
import helmet from 'helmet'
import cors from 'cors'
import logger from './middlewares/logger.js'
import router from './components/index.js'
import db from './config/db.js'
import { handleError } from './helpers/globalHandler.js'
dotenv.config()
const PORT = process.env.PORT || 9000;
const app = express();
const __dirname = path.resolve()


db
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(passport.initialize());
app.use(helmet())
app.use(cors())
app.use('/api/v1/', router)
app.use((err, req, res, next) => {
   handleError(err, res);
 });
app.listen(PORT, () => {
   logger.info(`Server started at port:${PORT}`)
})