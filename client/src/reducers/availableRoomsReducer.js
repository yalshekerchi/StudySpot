import _ from 'lodash';
import { FETCH_AVAILABLE_ROOMS } from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_AVAILABLE_ROOMS:
      return _.orderBy(action.payload, ['buildingCode']);
    default:
      return state;
  }
}
