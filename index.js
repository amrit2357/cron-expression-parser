const { parseCronString } = require('./src/cronParser');

/**
 * Process the provided cron string from the command line arguments.
 * If no cron string is provided, display an error message and exit.
 * @returns {void}
 */
function processCronString() {
    try {
        const cronString = process.argv[2];
        if (!cronString) {
            console.error('Please provide a cron string.');
            process.exit(1);
        }
        let parsedString = parseCronString(cronString);
        console.log(parsedString);
    } catch (err) {
        console.error('Error occured in processCronString:: ', err.message);
    }
}

processCronString();