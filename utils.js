//helper function to limit rate of firing of an argument function
const debounce = (func, delay = 500) => {
    let timeoutId;
    //...args means all arguments that the argument function might have
    return (...args) => {
        //if we have a function that was called inside setTimeout, and it 
        //hasn't run yet, then cancel it
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            //func.apply allows us to apply all arguments that might be 
            //passed to the function
            func.apply(null, args);
        }, delay);
    }
};