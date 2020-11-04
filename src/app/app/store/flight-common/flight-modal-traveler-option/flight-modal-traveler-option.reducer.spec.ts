import { reducer, initialState } from './flight-modal-traveler-option.reducer';

describe('FlightModalTravelerOption Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
