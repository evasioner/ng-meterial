import { reducer, initialState } from './hotel-modal-traveler-option.reducer';

describe('HotelModalTravelerOption Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
