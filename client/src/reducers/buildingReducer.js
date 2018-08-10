import _ from 'lodash';
import { FETCH_BUILDINGS } from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_BUILDINGS:
      return _.orderBy(action.payload, ['buildingCode']);
    default:
      return state;
  }
}
