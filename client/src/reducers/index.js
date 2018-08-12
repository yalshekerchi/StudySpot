import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import buildingReducer from './buildingReducer';
import availableBuildingsReducer from './availableBuildingsReducer';

export default combineReducers({
  buildings: buildingReducer,
  availableBuildings: availableBuildingsReducer,
  form: formReducer
});
