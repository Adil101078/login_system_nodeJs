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
            format: winston.format.combine(
               
                winston.format.timestamp({
                   format: 'MMM-DD-YYYY HH:mm:ss'
               }),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            ),
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: true,
            colorize: true,
            format: winston.format.combine(
               
                winston.format.timestamp({
                   format: 'MMM-DD-YYYY HH:mm:ss'
               }),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
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