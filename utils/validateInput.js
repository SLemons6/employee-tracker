// function to check if user input meets requirements

module.exports = function(obj, ...props) {
    const errors = [];

    props.forEach(prop => {
        // add error to array if property is undefined or missing
        if (obj[prop] === undefined || obj[prop] === '') {
            errors.push(`${prop} is undefined or missing.`);
        }
    });

    if (errors.length) {
        return {
            error: errors.join(', ')
        };
    }

    return null;
};