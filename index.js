/**
 * Module providing functions to connect to and interact with a Redis server.
 */

'use strict';

require('dotenv').config();
const Redis = require("ioredis");

/**
 * Connect to a Redis server instance referenced by its URL.
 * Redis URL format: redis://[<username>:<password>@]<host>[:<port>]/[<db>].
 * If the argument is undefined the URL specified by the environment variable
 * REDIS_URL is used. If the latter is missing the hardcoded default URL
 * "redis://localhost:6379/0" is used.
 * If the db index is unspecified it defaults to 0.
 * @param {String} url Optional Redis URL as character string.
 * @returns Redis connection object. 
 */
function connectRedis(url) {
    if (url && typeof(url) !== 'string') {
        throw new Error(`Illegal URL argument: ${url}`);
    }
    if (!url || !url.trim().length) {
        url = process.env.REDIS_URL;
    }
    if (!url || !url.trim().length) {
        url = "redis://localhost:6379/0";
    }
    const conn = new Redis(url);
    conn.on('error', err => {
        throw new Error(`Redis connection error: ${err.message} (${err.errno})`);
    });
    return conn;
}

/**
 * Disconnect silently a Redis connection.
 * @param {Object} conn Connection object to Redis as returned by connectRedis().
 * @returns 0 in case of success, 1 in case of failure.
 */
function disconnectRedis(conn) {
    try {
        conn.quit();
        return 0;
    } catch (err) {
        return 1;
    }
}

module.exports = {
    connectRedis, disconnectRedis,
}
