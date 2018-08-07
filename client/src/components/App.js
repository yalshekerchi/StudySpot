import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import Layout from './Layout';
import Landing from './Landing';
import RoomSearchForm from './RoomSearch/RoomSearchForm';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Layout>
            <Route exact={true} path='/' component={Landing} />
            <Route exact={true} path='/room-search' component={RoomSearchForm} />
          </Layout>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null)(App);
