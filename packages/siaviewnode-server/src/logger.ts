import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint } = format;

export default createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: './error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 2
        }),
        new transports.File({
            filename: './info.log',
            level: 'info',
            maxsize: 5242880,
            maxFiles: 5
        }),
    ],
    exitOnError: false,
});