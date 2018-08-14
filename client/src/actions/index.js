import axios from 'axios';
import moment from 'moment';

import { FETCH_BUILDINGS, FETCH_AVAILABLE_BUILDINGS } from './types';

export const fetchBuildings = () => async dispatch => {
  const res = await axios.get('/api/buildings');
  dispatch({ type: FETCH_BUILDINGS, payload: res.data });
};

export const fetchAvailableBuildings = (values, history) => async dispatch => {
  const reqBody = {
    buildings: values.buildings,
    date: moment(values.date).format('YYYYMMDD'),
    startTime: moment(values.startTime).diff(
      moment(values.endTime).startOf('day'),
      'seconds'
    ),
    endTime: moment(values.endTime).diff(
      moment(values.endTime).startOf('day'),
      'seconds'
    )
  };
  console.log(reqBody);
  const res = await axios.post('/api/search/buildings', reqBody);
  history.push('/search');
  dispatch({ type: FETCH_AVAILABLE_BUILDINGS, payload: res.data });
};
