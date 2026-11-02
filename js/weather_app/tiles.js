import * as SunCalc from '../suncalc/index.js';
import { location } from './main.js';

export const tiles = [];

export function initTiles() {
    tiles.forEach(t => t.init());
}

export function updateTiles() {
    tiles.forEach(t => t.update());
}

export class MoonTile {

    constructor() {
        this.currentDate = new Date().getDate();
        this.tile = document.getElementById("moon_tile");
        this.graphStepSize = 5;
    }

    init() {
        this.#drawGraph();
        this.#updateMoonStats();
    }

    update() {

        if(new Date().getDate() !== this.currentDate) {
            this.currentDate = new Date().getDate();
            //redraw line + adjust moon position
        } else {
            //adjust moon position
        }

    }

    #getMoonPositions() {

        const altitudes = [];
        for(let min = 0; min <= 1440; min += this.graphStepSize) {
            const startTime = new Date();
            startTime.setHours(0, 0, 0, 0);
            const time = new Date(startTime.getTime() + (min * 60000));
            const pos = SunCalc.getMoonPosition(time, location.lat, location.lon);
            altitudes.push(pos.altitude);
        }

        return altitudes;

    }

    #drawMoon(root_item, graphWidth, graphHeight) {

        const now = new Date();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const totalMsInDay = 24 * 60 * 60 * 1000;
        const x = ((now - todayStart) / totalMsInDay) * graphWidth;

        const moon_pos = SunCalc.getMoonPosition(now, location.lat, location.lon);
        const y = (1 - ((moon_pos.altitude + 90) / 180)) * graphHeight;

        const radius = 12.0;
        
        const moonIlluminaionData = SunCalc.getMoonIllumination(now);
        const phase = ((moonIlluminaionData.phase % 1) + 1) % 1;

        const p = phase < 0.5 ? phase : 1 - phase;
        const k = Math.cos(2 * Math.PI * p); // map phase to [-1, 1] (1 = new, -1 = full)
        const rx = Math.abs(k) * radius;
        const crescent = k > 0;

        const innerSweep = crescent ? 0 : 1;

        const illuminationPathData = [
            `M ${x} ${y - radius}`,
            `A ${radius} ${radius} 0 0 1 ${x} ${y + radius}`,
            `A ${rx} ${radius} 0 0 ${innerSweep} ${x} ${y - radius}`,
            "Z"
        ].join(" ");

        // base moon:
        root_item.appendChild(this.#svgItem("circle", {
            cx: x,
            cy: y,
            r: radius,
            fill: "black",
            stroke: "white",
            "stroke-width": 1.5,
        }));

        // moon illumination:
        const moon_rotation =  moon_pos.parallacticAngle - moonIlluminaionData.angle - 90.0;
        const illuminationPath = this.#svgItem("path", {
            d: illuminationPathData,
            fill: "white",
            "transform": `rotate(${moon_rotation} ${x} ${y})`
        });
        root_item.appendChild(illuminationPath);
        
    }

    #drawGraph() {

        const svgElement = this.tile.getElementsByTagName("svg")[0];
        const graphWidth = svgElement.viewBox.baseVal.width;
        const graphHeight = svgElement.viewBox.baseVal.height;
        
        const altitudes = this.#getMoonPositions();
        
        let linePoints = [];
        for(let i = 0; i < altitudes.length; i++) {

            const alt = altitudes[i];
            const x = ((i * this.graphStepSize)/1440) * graphWidth;
            const y = (1 - ((alt + 90) / 180)) * graphHeight;
            
            linePoints.push(`${x},${y}`)
        }
        linePoints = linePoints.join(" L ");
        const linePath = "M " + linePoints;

        svgElement.innerHTML = "";
        const root = this.#svgItem('g', {});

        const heights = [0.5, Math.floor(0.25 * graphHeight) + 0.5,  Math.floor(0.75 * graphHeight) + 0.5, graphHeight - 0.5];
        for(let i = 0; i < 4; i++) {
            root.appendChild(this.#svgItem('line', {
                x1: 0,
                x2: graphWidth,
                y1: heights[i],
                y2: heights[i],
                class: "grid_line",
                "stroke-width": 1.0
            }));
        }

        root.appendChild(this.#svgItem('path', {
            class: "altitude_path",
            d: linePath,
            fill: "none",
            "stroke-width": 2.6,
            "stroke-linecap": "square",
        }));

        root.appendChild(this.#svgItem('line', {
            x1: 0,
            x2: graphWidth,
            y1: 0.5 * graphHeight,
            y2: 0.5 * graphHeight,
            class: "horizon_line",
            "stroke-width": 2.0
        }));

        this.#drawMoon(root, graphWidth, graphHeight);

        

        svgElement.appendChild(root);

    }

    #svgItem(tag, attrs) {
        const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for(const k in attrs) {
            e.setAttribute(k, attrs[k]);
        }
        return e;
    }

    #updateMoonStats() {
        const now = new Date();
        const moon_times = SunCalc.getMoonTimes(now, location.lat, location.lon, -now.getTimezoneOffset());
        const moonIlluminaionData = SunCalc.getMoonIllumination(now);
        const moon_pos = SunCalc.getMoonPosition(now, location.lat, location.lon);
        
        console.log(moon_times.rise);
        console.log(moon_times.set);

        let moon_riseText = "-";
        if(moon_times.rise) {
            moon_riseText = moon_times.rise.getHours() + ":" + moon_times.rise.getMinutes();
        }

        let moon_setText = "-";
        if(moon_times.set) {
            moon_setText = moon_times.set.getHours() + ":" + moon_times.set.getMinutes();
        }

        this.tile.querySelector(".moon_rise").textContent = moon_riseText;
        this.tile.querySelector(".moon_set").textContent = moon_setText;
        this.tile.querySelector(".moon_illumination").textContent = (moonIlluminaionData.fraction * 100.0).toFixed(1) + "%";
        this.tile.querySelector(".moon_size").textContent = "+" + Math.max((100.0 - (moon_pos.distance / 4069)).toFixed(1), 0) + "%";
        this.tile.querySelector(".moon_direction").textContent = moon_pos.azimuth.toFixed(0) + "°";
        this.tile.querySelector(".moon_direction_arrow").style.transform = "rotate(" + moon_pos.azimuth + "deg)";
    }

}
tiles.push(new MoonTile());