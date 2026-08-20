import * as SunCalc from '../suncalc/index.js';

class MoonTile {

    constructor() {
        this.currentDate = new Date().getDate();
        this.tile = document.getElementById("moon_tile");
        this.graphStepSize = 5;

        this.init();
    }

    init() {
        this.#drawGraph();
    }

    update() {

        if(new Date().getDate() !== this.currentDate) {
            //redraw line
        } else {
            //adjust moon position
        }

    }

    #getMoonPositions() {

        const altitudes = [];
        for(let min = 0; min <= 1440; min += this.graphStepSize) {
            const startTime = new Date();
            //startTime.setFullYear(2026, 2, 25);
            startTime.setHours(0, 0, 0, 0);
            const time = new Date(startTime.getTime() + (min * 60000));
            const pos = SunCalc.getMoonPosition(time, 28.2, 99.3);
            altitudes.push(pos.altitude);
        }

        console.log(altitudes);
        return altitudes;

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

        svgElement.innerHTML = '';
        const root = this.#svgItem('g', {});

        root.appendChild(this.#svgItem('path', {
            class: "altitude_path",
            d: linePath,
            fill: 'none',
            'stroke-width': 2.6,
            //'clip-path': 'url(#clipAbove)'
        }));

        root.appendChild(this.#svgItem('line', {
            x1: 0,
            x2: graphWidth,
            y1: 0.5 * graphHeight,
            y2: 0.5 * graphHeight,
            class: "horizon_line",
            'stroke-width': 2.0
        }));

        

        svgElement.appendChild(root);

    }

    #svgItem(tag, attrs) {
        const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for(const k in attrs) {
            e.setAttribute(k, attrs[k]);
        }
        return e;
    }


}


export const tiles = [new MoonTile()];