import _ from 'lodash';
import { FETCH_AVAILABLE_BUILDINGS } from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_AVAILABLE_BUILDINGS:
      return _.orderBy(action.payload, ['buildingCode']);
    default:
      return state;
  }
}
