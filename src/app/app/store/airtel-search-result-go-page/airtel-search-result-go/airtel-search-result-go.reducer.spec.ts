import { reducer, initialState } from './airtel-search-result-go.reducer';

describe('AirtelSearchResultGo Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
