import * as SunCalc from '../suncalc/index.js';


class MoonTile {

    constructor() {
        this.currentDate = new Date().getDate();

        this.init();
    }

    init() {

    }

    update() {

        if(new Date().getDate() !== this.currentDate) {
            //redraw line
        } else {
            //adjust moon position
        }

    }


}