import axios from 'axios';
import moment from 'moment';

import {
  FETCH_BUILDINGS,
  FETCH_AVAILABLE_BUILDINGS,
  FETCH_ROOM
} from './types';

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
  const res = await axios.post('/api/search/buildings', reqBody);
  history.push('/search/results');
  dispatch({ type: FETCH_AVAILABLE_BUILDINGS, payload: res.data });
};

export const fetchRoom = (
  buildingCode,
  roomNumber,
  pathname = null,
  history = null
) => async dispatch => {
  const res = await axios.get(
    `/api/buildings/${buildingCode}/rooms/${roomNumber}`
  );
  if (history) {
    history.push(`${pathname}/${roomNumber}`);
  }
  dispatch({ type: FETCH_ROOM, payload: res.data });
};
