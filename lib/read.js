'use strict';

const _ = require('lodash');
const nodemailer = require('nodemailer');
const axios = require('axios');

const FOLDER_ID = process.env.FOLDER_ID;
const TRANSLATE_URL = 'https://translate.api.cloud.yandex.net/translate/v2/translate';

const envAxios = axios.create({
    timeout: 10 * 1000,
})

const transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
        user: process.env.SMTP_USER_LOGIN,
        pass: process.env.SMTP_USER_PASSWORD,
    }
});

async function readMessage(messages) {
    const message = _.get(messages, ['messages', '0', 'details', 'message']);
    const messageText = _.get(message, ['body'])
    let translatedMessageText;

    if (!messageText) {
        return Promise.reject('EMPTY_MESSAGE');
    }

    try {
        const response = await envAxios({
            method: 'POST',
            url: TRANSLATE_URL,
            headers: {
                Authorization: `Api-Key ${process.env.AI_KEY}`,
            },
            data: {
                folderId: FOLDER_ID,
                sourceLanguageCode: "en",
                targetLanguageCode: "ru",
                texts: [messageText],
            },

        });

        if (_.get(response, ['data', 'translations', 0, 'text'])) {
            translatedMessageText = _.get(response, ['data', 'translations', 0, 'text']);
        }
    } catch (error) {
        console.error(error);
    }

    const mail = {
        to: process.env.MAIL_TO,
        from: process.env.SMTP_USER_LOGIN,
        subject: 'YC Serverless function',
        html: `${messageText} / ${translatedMessageText}`,
    };

    await transporter.sendMail(mail);
}

module.exports = readMessage;
