import mongoose from 'mongoose'
import logger from '../middlewares/logger.js'


const db = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => {
    logger.info('Connected to Database')
    }, (error) => {
    logger.error(error)
   }
);

export default db
