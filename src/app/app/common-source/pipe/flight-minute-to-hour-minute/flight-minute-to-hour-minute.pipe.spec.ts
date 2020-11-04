import { FlightMinuteToHourMinutePipe } from './flight-minute-to-hour-minute.pipe';

describe('FlightMinuteToHourMinutePipe', () => {
    it('create an instance', () => {
        const pipe = new FlightMinuteToHourMinutePipe();
        expect(pipe).toBeTruthy();
    });
});
