exports.getDate =  () => {
        
    const weekDay = new Date();

    const options = {
        month: "long",
        day: "numeric"
    };

    return weekDay.toLocaleDateString("en-US",options);
};

exports.getDay = function () {
        
    const weekDay = new Date();

    const options = {
        weekday: "long"
    };

    return weekDay.toLocaleDateString("en-US",options);    
};