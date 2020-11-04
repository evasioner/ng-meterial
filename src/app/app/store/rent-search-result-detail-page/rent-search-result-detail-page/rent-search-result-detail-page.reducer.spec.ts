import { reducer, initialState } from './rent-search-result-detail-page.reducer';

describe('RentSearchResultDetailPage Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
