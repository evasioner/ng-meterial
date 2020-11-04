import { reducer, initialState } from './my-flight-extra-svc-page.reducer';

describe('MyFlightExtraSvcPage Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
