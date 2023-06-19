const schedulerFiles = require('./index.js');

function listTasks() {
    console.log('Scheduled tasks:');

    Object.keys(schedulerFiles).forEach((schedulerName) => {
        const scheduler = schedulerFiles[schedulerName];
        const tasks = scheduler.getTasks();

        console.log(`Scheduler: ${schedulerName}`);
        console.log('Tasks:');
        tasks.forEach((task) => {
            console.log(`- Task: ${task.cronTime}`);
            // task.cronTime.source
        });
        console.log();
    });
}

listTasks();
