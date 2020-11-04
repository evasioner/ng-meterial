import { NumberPadPipe } from './number-pad.pipe';

describe('NumberPadPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberPadPipe();
    expect(pipe).toBeTruthy();
  });
});
