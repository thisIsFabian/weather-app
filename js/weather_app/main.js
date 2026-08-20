import * as SunCalc from '../suncalc/index.js';
import { getDeviceLocation } from './utils.js';


const locationLat = 52.0;
const locationLong = 10.0;

//console.log(getDeviceLocation());

const times = SunCalc.getTimes(new Date(), locationLat, locationLong);
console.log(`Sunrise time: ${times.sunrise.toLocaleString()}`);



const div = document.getElementById("test");

const nowDate = new Date();
const moonTimes = SunCalc.getMoonTimes(nowDate, locationLat, locationLong);
const moonIllumination = SunCalc.getMoonIllumination(nowDate);

div.innerHTML = `Moon rise: ${moonTimes.rise.toTimeString().split(' ')[0]} <br>
                Moon set: ${moonTimes.set.toLocaleString()} <br>
                Moon brightness: ${moonIllumination.fraction}`;

