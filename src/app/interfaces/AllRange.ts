import {State} from './State';

export interface AllRange {
  id: string;
  offer_id?: string;
  created_at: string;
  updated_at: string;
  state: State;
  range: Range;
}
