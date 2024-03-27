const { CONSTANTS } = require('../utils/constants');
const _ = require('lodash');
/**
 * Get range values from a range string.
 * @param {string} rangeStr - Range string in the format "start-end".
 * @returns {number[]}
 */
function getRangeValues(rangeStr) {
    const [start, end] = rangeStr.split("-").map(Number);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Get range values from a range string.
 * @param {string} rangeStr - Range string in the format "start-end".
 * @returns {number[]}
 */
function getRange(min, max) {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

/**
 * Get step values within a range.
 * @param {string} stepStr - step string.
 * @param {number} minValue - minimum value
 * @param {number} maxValue - maximum value
 * @returns {number[]}
 */
function getStepValues(stepStr, minValue, maxValue) {
        const values = [];
        if (isNumeric(stepStr) && isNumeric(minValue) && isNumeric(maxValue)) {
            const step = parseInt(stepStr, 10);
            for (let value = Number(minValue); value <= Number(maxValue); value++) {
                if ((value - minValue) % step === 0) {
                    values.push(value);
                }
            }
            return values;
        }
}

/**
 * Check if the given array of cron fields is valid.
 * @param {Object} fields - Parameters for the field being parsed .
 * @returns {Array[]} - return array of elements.
 */
function extractStepExpression(params) {
    const { segment, min, max, fieldName } = params;
    let currentElement = [];
    const stepParts = segment.split(CONSTANTS.STEP);
    if (stepParts.length === 2) {
        if (stepParts[0].includes(CONSTANTS.RANGE)) {
            const rangeValues = stepParts[0].split(CONSTANTS.RANGE);
            if (!isStepRangeValid(rangeValues, min, max)) {
                throw new Error(`Invalid cron Expression for ${fieldName} : ${segment} (min : ${min}, max: ${max})`);
            }
            currentElement = getStepValues(stepParts[1], rangeValues[0], rangeValues[1]);
        } else if (stepParts[0] == '*') {
            currentElement = getStepValues(stepParts[1], min, max);
        } else {
            currentElement = getStepValues(stepParts[1], stepParts[0], max);
        }
    } else {
        throw new Error(`Invalid cron Expression for ${fieldName} : ${segment} (min : ${min}, max: ${max})`);
    }
    return currentElement;
}

/**
 * Check if the given array of cron fields is valid.
 * @param {Object} fields - Array of cron fields.
 * @returns {Array[]} - return array of elements.
 */
function extractRangeExpression(params) {
    const { segment, min, max } = params;
    const rangeValues = segment.split(CONSTANTS.RANGE);
    if (!isStepRangeValid(rangeValues, min, max)) {
        throw new Error(`Invalid cron Expression for ${segment} (min : ${min}, max: ${max})`);
    }
    return getRangeValues(segment);
}


/**
 * Function : isNumeric
 * Description : Check if the number is numeric
 */
function isNumeric(value) {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && !isNaN(parseFloat(numericValue)) && isFinite(numericValue)) {
        return true;
    }
    throw new Error(`Invalid Cron Expression for :: ${value}`);
}

/**
 * Check if the given array of cron fields is valid.
 * @param {Array} fields - Array of cron fields.
 * @returns {boolean} - True if the fields array is valid (contains at least 6 elements), otherwise false.
 */
function isCronValid(fields) {
    return fields && fields.length == 6;
}

/**
 * Checks if the range values for a step are valid.
 * @param {number[]} rangeValues - The range values to validate.
 * @param {number} min - min allowed value.
 * @param {number} max - max allowed value.
 * @returns {boolean} - True if the range values are valid, false otherwise.
 */
function isStepRangeValid(rangeValues, min, max) {
    return Number(rangeValues[0]) <= Number(rangeValues[1]) && isNumberBetweenMinMax(rangeValues[0], min, max) &&
        isNumberBetweenMinMax(rangeValues[1], min, max)
}

/**
 * Checks if a number is between the given minimum and maximum values.
 * @param {number} number - The number to check.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @returns {boolean} - True if the number is between the min and max values, false otherwise.
 */
function isNumberBetweenMinMax(number, min, max) {
    return Number(number) <= Number(max) && Number(number) >= Number(min);
}

/**
 * Parses the expression based on the provided field parameters.
 * @param {Object} fieldParams - Parameters for the field being parsed.
 * @param {array} allFields - Array of all fields to be parsed.
 * @param {number} index - Index of the field to be parsed in the `allFields` array.
 * @returns {string} - Parsed expression.
 */

function parseExpression(fieldParams, allFields, index) {
    const { min, max } = fieldParams;
    const fieldName = fieldParams.name;
    const currentSegment = allFields[index];
    const segments = currentSegment.split(',');
    let finalValue = [];
    segments.forEach(segment => {
        segment = segment.trim();
        const params = {
            min, max, segment, fieldName
        };
        let currentElement = [];
        if (segment === CONSTANTS.ANY) {
            currentElement = getRange(min, max);
        } else if (segment.includes(CONSTANTS.STEP)) {
            currentElement = extractStepExpression(params);
        } else if (segment.includes(CONSTANTS.RANGE)) {
            currentElement = extractRangeExpression(params)
        } else {
            currentElement = isNumeric(segment) ? [ parseInt(segment) ] : '';
        }
        finalValue = finalValue.concat(currentElement);
    });
    // Handle unwanted cases
    finalValue.forEach((item) => {
        if (item < min || item > max) {
            throw new Error(`Invalid cron Expression for ${fieldName} : ${segments} (min : ${min}, max: ${max})`);
        }
    });
    return `${fieldName.padEnd(14)}${_.uniq(finalValue.sort((a, b) => a - b)).join(" ")}`
}

module.exports = {
    extractStepExpression,
    extractRangeExpression,
    isNumeric,
    getStepValues,
    getRange,
    getRangeValues,
    isStepRangeValid,
    isNumberBetweenMinMax,
    isCronValid,
    parseExpression
}
