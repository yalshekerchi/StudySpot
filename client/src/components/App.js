import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Layout from './Layout';
import Landing from './Landing';
import RoomSearchForm from './RoomSearch/RoomSearchForm';
import BuildingList from './BuildingList';
import BuildingDetail from './BuildingDetail';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Layout>
            <Route exact={true} path="/" component={Landing} />
            <Route exact={true} path="/search" component={RoomSearchForm} />
            <Switch>
              <Route path="/search/results" component={BuildingList} />
              <Route path="/search/:code" component={BuildingDetail} />
            </Switch>
          </Layout>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null)(App);
