import mongoose from 'mongoose'
import logger from '../middlewares/logger.js'

const db = mongoose.createConnection(process.env.MONGODB_URL, {
    readPreference: 'primaryPreferred',
    useNewUrlParser: true,
    useUnifiedTopology: true
})

db.on('connected', () => {
	logger.info('Connected to Mongoose Database')
})

db.on('error', (err) => {
	logger.debug(`Mongoose connection error for master DB: ${err.message}`)
})


db.on('disconnected', () => {
	logger.debug('Mongoose connection disconnected for master DB')
})


db.on('reconnected', () => {
	logger.info('Mongoose connection reconnected for master DB')
})

process.on('SIGINT', () => {
	db.close(() => {
		logger.debug(
			'Mongoose connection disconnected for master DB through app termination'
		)
		process.exit(0)
	})
})


export default db
