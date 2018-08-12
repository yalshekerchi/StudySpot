import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import Layout from './Layout';
import Landing from './Landing';
import RoomSearchForm from './RoomSearch/RoomSearchForm';
import BuildingList from './BuildingList';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Layout>
            <Route exact={true} path='/' component={Landing} />
            <Route exact={true} path='/search/' component={BuildingList} />
            <Route path='/search/new' component={RoomSearchForm} />
          </Layout>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null)(App);
