import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import buildingReducer from './buildingReducer';
import availableRoomsReducer from './availableRoomsReducer';

export default combineReducers({
  buildings: buildingReducer,
  availableRooms: availableRoomsReducer,
  form: formReducer
});
