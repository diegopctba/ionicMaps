import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name: 'secondsToTime'
})
export class TimePipe implements PipeTransform {
    times = {
        year: 31557600,
        month: 2629746,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    }

    transform(time) {
        console.log('time '+time);
        let time_string: string = '';
        let plural: string = '';
        for (var key in this.times) {
            if (Math.floor(time / this.times[key]) > 0) {
                if (Math.floor(time / this.times[key]) > 1) {
                    plural = 's';
                }
                else {
                    plural = '';
                }

                time_string += Math.floor(time / this.times[key]).toString() + ' ' + key.toString() + plural + ' ';
                time = time - this.times[key] * Math.floor(time / this.times[key]);

            }
        }
        return time_string;
    }
}