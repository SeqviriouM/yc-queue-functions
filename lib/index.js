'use strict';

const dotEnv = require('dotenv');
dotEnv.config();

const readMessage = require('./read');
const sendMessage = require('./send');

module.exports = {
    read: readMessage,
    send: sendMessage,
};
