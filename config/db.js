import mongoose from 'mongoose'
import logger from '../middlewares/logger.js'


const db = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => {
    logger.info('Connected to Database')
    }, (err) => {
    logger.error(err.message)
   }
);

export default db
