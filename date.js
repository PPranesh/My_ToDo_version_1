const request = require("request");

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );

var date = "";

function search() {
 
    request("http://worldtimeapi.org/api/timezone/Asia/Kolkata.json", function(error, response, body) {

        result = JSON.stringify(body);
        result = JSON.parse(body);
        var data = result.datetime;
        date = data.slice(0,10);
    });
};


exports.gettingIndiaDate = () => {

    search();

    let d = m = y = "";
    d = date.slice(8,10);
    m = date.slice(5,7);
    y = date.slice(0,4);

    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let wordDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    m = m-1;
    let dayy = Number(getExactDay(month[m]+' '+d+', '+y));

    return (wordDay[dayy]+", "+month[m]+" "+d);
};

function getExactDay(e_date) {

    let dd = new Date(e_date).getDay();

    return dd;
};

function timeConvertor_AM_PM(input_time) {

    var hour,hr,mm,ss,timeStamp,date;
    hour = input_time.slice(0,2);
    mm = input_time.slice(3,5);
    ss = input_time.slice(6,8);

    if (hour > 11) {        // 11+
        timeStamp = "PM";
        if (hour === '12'){     // 12
            hr = hour;
        } else {       // 12+
            
            if( (hour > 12) && (hour < 23) ){      // 13~22
                hour = hour-12;
                hr = "0"+hour;   
            }
        }
        
    } else {
        timeStamp = "AM";
        hr = hour;
    }
    return (hr+" : "+mm+" : "+ss+" "+timeStamp);
};

exports.getDate =  () => {
        
    const weekDay = new Date();

    const options = {
        month: "long",
        day: "numeric"
    };
    // console.log("date - "+date);
    return weekDay.toLocaleDateString("en-US",options);
};

exports.getDay = function () {
        
    const weekDay = new Date();

    const options = {
        weekday: "long"
    };

    return weekDay.toLocaleDateString("en-US",options);    
};