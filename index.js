import { readFileSync } from "node:fs";
import https from "node:https";
import path from "node:path";

import express from "express";
import log4js from "log4js";
import morgan from "morgan";
import bearerToken from "express-bearer-token";

import config from "./config.js";

init();



function initExpress(logger) {
    logger.info("Initializing Express middleware");
    const app = express();

    logger.debug("Loading static serving middleware");
    app.use(express.static(path.join(process.cwd(), config.PUBLIC_DIR)));

    logger.debug("Loading Morgan middleware");
    app.use(morgan("combined", {
        stream: {
            write: (message) => {
                logger.info(message.trim());
            }
        }
    }));

    logger.debug("Loading JSON body parser middleware");
    app.use(express.json());

    logger.debug("Loading file upload body parser middleware");
    app.use(express.raw({ limit: "512kb" }));

    logger.debug("Loading bearer token middleware");
    app.use(bearerToken());

    logger.info("Initializing SSL");
    const server = https.createServer({
        key: readFileSync(config.https.key),
        cert: readFileSync(config.https.cert)
    }, app);
    
    logger.info("Starting Express server");
    server.listen(config.PORT).once("listening", () => {
        logger.info("Listening on port *:" + config.PORT);
    });
}

function init() {
    log4js.configure({
        appenders: {
            console: { type: "console" },
            file: { type: "file", filename: "server.log" },
            consoleFilter: {
                type: "logLevelFilter",
                appender: "console",
                level: "info"
            }
        },
        categories: {
            default: {
                appenders: ["consoleFilter", "file"],
                level: "debug"
            }
        }
    });

    const logger = log4js.getLogger();

    initExpress(logger);
}