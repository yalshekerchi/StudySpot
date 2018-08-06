import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import buildingReducer from './buildingReducer';

export default combineReducers({
  buildings: buildingReducer,
  form: formReducer
});
