const { fieldRanges } = require('../utils/constants');
const { isCronValid, parseExpression } = require('../utils/parserHelper');
const _ = require('lodash');

/**
 * Generate formatted output for parsed cron information.
 * @param {string} parsedCron - Parsed cron information object.
 * @returns {string} - Formatted output string.
 */
function parseCronString(cronExpression) {
    const fields = cronExpression.split(/\s+/);
    if (!isCronValid(fields)) {
        console.error('Please provide a valid cron string. Ex: minute hour day-of-month month day-of-week command');
        process.exit(1);
    }
    let formatAsTable = [];
    fieldRanges.forEach((fieldParams, index) => {
        const output = parseExpression(fieldParams, fields, index);
        formatAsTable.push(output);
    });

    formatAsTable.push(`${'command'.padEnd(14)}${fields[5]}`);
    formatAsTable = formatAsTable.join("\n");
    return formatAsTable;
}

module.exports = {
    parseCronString
}
