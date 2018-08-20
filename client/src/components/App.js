import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '../../node_modules/material-ui-pickers';
import { MomentUtils } from '../../node_modules/material-ui-pickers/utils/moment-utils';

import Layout from './Layout';
import Landing from './Landing';
import RoomSearchForm from './RoomSearch/RoomSearchForm';
import BuildingList from './BuildingList';
import BuildingDetail from './BuildingDetail';
import RoomDetail from './RoomDetail';

class App extends Component {
  render() {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <BrowserRouter>
          <Layout>
            <Route exact={true} path="/" component={Landing} />
            <Route exact={true} path="/search" component={RoomSearchForm} />
            <Route
              exact={true}
              path="/room-explorer"
              component={BuildingList}
            />
            <Switch>
              <Route
                path="/room-explorer/:buildingCode/:roomNumber"
                component={RoomDetail}
              />
              <Route
                path="/room-explorer/:buildingCode"
                component={BuildingDetail}
              />
            </Switch>
            <Switch>
              <Route
                path="/search/results/:buildingCode/:roomNumber"
                component={RoomDetail}
              />
              <Route
                path="/search/results/:buildingCode"
                component={BuildingDetail}
              />
              <Route path="/search/results" component={BuildingList} />
            </Switch>
          </Layout>
        </BrowserRouter>
      </MuiPickersUtilsProvider>
    );
  }
}

export default connect(null)(App);
