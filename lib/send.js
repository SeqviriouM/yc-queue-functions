'use strict';

const AWS = require('aws-sdk');
const format = require('date-fns/format');
const _ = require('lodash');

const QUEUE_URL = 'https://message-queue.api.cloud.yandex.net/b1ghaqtki3a1iejcv8fa/dj6000000000hvdd01u1/suffering123494-queue';

AWS.config.update({region: 'ru-central1', credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
}});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

function generateDefaultMessage() {
    const date = format(new Date(), 'dd.MM.yyyy HH:mm:ss');

    return `Hello from serverless function ${date}`;
}

async function sendMessage(message) {
    const messageBody = message || generateDefaultMessage();

    const params = {
        DelaySeconds: 10,
        MessageBody: messageBody,
        QueueUrl: QUEUE_URL
    };

    return new Promise((resolve, reject) => {
        sqs.sendMessage(params, function(err, data) {
            if (err) {
                return reject(err);
            } else {
                return resolve(data);
            }
        });
    })
}

module.exports = sendMessage;