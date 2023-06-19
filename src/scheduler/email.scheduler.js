const cron = require('node-cron');

cron.schedule('* * * * *', () => {
    // Task logic to be executed at the scheduled interval (Cron 1)
    console.log('Email cron job 1 executed!');
});

module.exports = cron;
