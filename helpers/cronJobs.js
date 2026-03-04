const cron = require('node-cron');

const { pendingToApproved, updateUserRoleAndStatus } = require('../controllers/authController');

const startCronJobs = async () => {
    cron.schedule('55 23 * * *', async () => {
        // this background job will run every 12:52 pm every day and update all users with pending status to approved
        console.log('Running daily cron job at 12:52Pm to update pending users to approved');
        await pendingToApproved();
    });

    
//write a bakground job that runs every 3am and 3pm on sundays and update user role to inputer and status back to pending
    cron.schedule('0 3,15 * * 0', async() => {
        console.log('Running cron job at 3am and 3pm on Sundays to update user role and status');
        await updateUserRoleAndStatus();
    });
    
}
module.exports = { startCronJobs }; 
