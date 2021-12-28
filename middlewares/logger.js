import winston from 'winston'


const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level:'info',
            filename: './logs/logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880,
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: true,
            colorize: true,
            timestamp: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: './logs/exception.log',
            maxsize: 5242880,
            timestamp: true,
            colorize: true,
            json: true
        })
    ], 
    exitOnError: false
})

logger.stream = {
    write(message) {
        logger.info(message)
    }
}
export default logger