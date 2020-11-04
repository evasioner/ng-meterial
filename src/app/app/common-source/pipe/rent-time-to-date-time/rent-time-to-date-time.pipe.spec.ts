import { RentTimeToDateTimePipe } from './rent-time-to-date-time.pipe';

describe('RentTimeToDateTimePipe', () => {
    it('create an instance', () => {
        const pipe = new RentTimeToDateTimePipe();
        expect(pipe).toBeTruthy();
    });
});
