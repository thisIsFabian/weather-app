import "./search_bar.js";
import { initTiles } from './tiles.js';



export let location = null;

export function setLocation(loc) {
    location = loc;
}

let locationStorage = localStorage.getItem("location");
if(locationStorage !== null) {
    location = JSON.parse(locationStorage);
    document.getElementById("searchbar").value = location.name;
    initTiles();
} else {
    //TODO: display empty screen
}




//console.log(getDeviceLocation());

//const times = SunCalc.getTimes(new Date(), locationLat, locationLong);
//console.log(`Sunrise time: ${times.sunrise.toLocaleString()}`);



/*const div = document.getElementById("test");

const nowDate = new Date();
const moonTimes = SunCalc.getMoonTimes(nowDate, locationLat, locationLong);
const moonIllumination = SunCalc.getMoonIllumination(nowDate);

div.innerHTML = `Moon rise: ${moonTimes.rise.toTimeString().split(' ')[0]} <br>
                Moon set: ${moonTimes.set.toLocaleString()} <br>
                Moon brightness: ${moonIllumination.fraction}`;*/
