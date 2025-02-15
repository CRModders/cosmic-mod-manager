export enum LogType {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
}

const LogDebugMessages = false;

export function Log(msg: string, level = LogType.INFO, subType?: string) {
    if (level === LogType.DEBUG && !LogDebugMessages) return;
    const timestamp = new Date().toISOString();

    if (subType) return console.log(`[${level}] ${subType}: ${msg} - ${timestamp}`);
    console.log(`[${level}] ${msg} - ${timestamp}`);
}

export enum Log_SubType {
    AUTH = "Auth",
    OAUTH = "OAuth",
    PROJECT = "Project",
    MODERATION = "Moderation",
    USER = "User",
    VERSION = "Version",
    FS = "FS",
    IMAGE_PROCESSING = "ImageProcessing",
}
