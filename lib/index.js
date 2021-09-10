'use strict';

const dotEnv = require('dotenv');
dotEnv.config();

const readMessage = require('./read');

module.exports = {
    read: readMessage,
};
