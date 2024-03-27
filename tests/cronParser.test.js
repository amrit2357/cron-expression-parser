const assert = require('assert');
const {
    parseCronString,
    isStepRangeValid,
    isNumberBetweenMinMax,
    isCronValid
} = require('../src/cronParser');

describe('parseCronString function', () => {
    it('should return formatted string representation for a valid cron expression', () => {
        const cronExpression = '0 0 */3 * * /user/user';
        const expectedOutput = `minute        0\nhour          0\nday of month  1 4 7 10 13 16 19 22 25 28 31\nmonth         1 2 3 4 5 6 7 8 9 10 11 12\nday of week   0 1 2 3 4 5 6 7\ncommand       /user/user`;
        const result = parseCronString(cronExpression);
        assert.strictEqual(result, expectedOutput);
    });

    it('should return formatted string representation for a valid cron expression', () => {
        const cronExpression = '1 0 */3 * * /user/user';
        const expectedOutput = `minute        1\nhour          0\nday of month  1 4 7 10 13 16 19 22 25 28 31\nmonth         1 2 3 4 5 6 7 8 9 10 11 12\nday of week   0 1 2 3 4 5 6 7\ncommand       /user/user`;
        const result = parseCronString(cronExpression);
        assert.strictEqual(result, expectedOutput);
    });

    it('should return formatted string representation for a valid cron expression', () => {
        const cronExpression = '1 1-2 */3 * * /user/user';
        const expectedOutput = `minute        1\nhour          1 2\nday of month  1 4 7 10 13 16 19 22 25 28 31\nmonth         1 2 3 4 5 6 7 8 9 10 11 12\nday of week   0 1 2 3 4 5 6 7\ncommand       /user/user`;
        const result = parseCronString(cronExpression);
        assert.strictEqual(result, expectedOutput);
    });

});

describe('isStepRangeValid function', () => {
    it('should return true for valid step range', () => {
        assert.strictEqual(isStepRangeValid(['10', '20'], 0, 59), true);
    });
});

describe('isNumberBetweenMinMax function', () => {
    it('should return true for number between min and max', () => {
        assert.strictEqual(isNumberBetweenMinMax(5, 0, 10), true);
    });
});

describe('isCronValid function', () => {
    it('should return true for a valid cron expression', () => {
        assert.strictEqual(isCronValid(['*', '*', '*', '*', '*', '*']), true);
    });

    it('should return false for an invalid cron expression', () => {
        assert.strictEqual(isCronValid(['*', '*', '*', '*', '*']), false);
    });
});
