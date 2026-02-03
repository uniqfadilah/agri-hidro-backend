"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config = {
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: { min: 1, max: 5 },
        migrations: {
            directory: './migrations',
            extension: 'ts',
        },
        seeds: {
            directory: './seeds',
            extension: 'ts',
        },
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool: { min: 2, max: 10 },
        migrations: {
            directory: './migrations',
            extension: 'ts',
        },
        seeds: {
            directory: './seeds',
            extension: 'ts',
        },
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map