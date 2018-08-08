import axios from 'axios';

import { FETCH_BUILDINGS } from './types';

export const fetchBuildings = () => async (dispatch) => {
  const res = await axios.get('/api/buildings');
  dispatch({ type: FETCH_BUILDINGS, payload: res.data });
};
