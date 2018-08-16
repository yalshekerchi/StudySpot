import { FETCH_ROOM } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_ROOM:
      return action.payload;
    default:
      return state;
  }
}
