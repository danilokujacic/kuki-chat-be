require('dotenv').config();

const config = {
    development: {
        host: process.env.HOST_LOCAL,
        'database-host': process.env.DATABASE_LOCAL,
        'frontend-host': process.env.FRONTEND_LOCAL,
    },
    production: {
        host: process.env.HOST_PRODUCTION,
        'database-host': `${process.env.DATABASE_PRODUCTION}`,
        'frontend-host': process.env.FRONTEND_PRODUCTION,
    },
};

module.exports = config;
