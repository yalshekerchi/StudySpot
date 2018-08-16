import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import buildingsReducer from './buildingsReducer';
import availableBuildingsReducer from './availableBuildingsReducer';
import roomReducer from './roomReducer';

export default combineReducers({
  buildings: buildingsReducer,
  availableBuildings: availableBuildingsReducer,
  room: roomReducer,
  form: formReducer
});
