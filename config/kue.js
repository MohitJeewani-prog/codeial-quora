//used to send multiple mails at different times
const kue = require('kue');

const queue = kue.createQueue();

module.exports = queue;