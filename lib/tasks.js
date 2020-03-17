const cron = require('node-cron');
const path = require('path');
const { Worker } = require('worker_threads');

function updateData() {
  const worker = new Worker(path.join(__dirname, 'workers/updateData.js'));
  worker.on('error', err => console.error(err));
  worker.on('exit', code => {
    if(code !== 0) return console.error(`Failed to update data, worker stopped with exit code ${code}`);
    console.log('Updated data successfully!');
  });
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', () => updateData());

updateData();
