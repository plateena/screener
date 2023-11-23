/**
 * Transform an array of objects into an object where each key corresponds to a property,
 * and the values are arrays containing the values of that property across all objects.
 * @param {Array} data - The array of objects to transform.
 * @param {Array} [propertiesToInclude=[]] - The array of property names to include (optional).
 * @param {Object} [conditions={}] - The user-defined condition object (optional).
 * @returns {Object} - The transformed object.
 */
const transformArrayToObject = (data, propertiesToInclude = [], conditions = {}) => {
    try {
        return propertiesToInclude.reduce((acc, key) => {
            // Skip 'date' property
            if (key !== 'date') {
                const conditionFn = conditions[key] || (() => true);

                // Check if 'data' is an array and has the 'some' function
                if (Array.isArray(data) && typeof data.some === 'function') {
                    // Check if the property exists in any object
                    if (!data.some(obj => key in obj)) {
                        console.warn(`Property '${key}' does not exist in some objects. Skipping.`);
                        return acc;
                    }
                } else {
                    console.warn(`Input 'data' is not an array or does not have a 'some' function.`);
                    return acc;
                }

                acc[key] = data.filter(obj => conditionFn(obj[key])).map(obj => obj[key]);
            }
            return acc;
        }, {});
    } catch (error) {
        console.error('An error occurred:', error.message);
        return {};
    }
};

export { transformArrayToObject };
