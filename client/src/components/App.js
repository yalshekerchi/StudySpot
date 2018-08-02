import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import Layout from './layout';
import Landing from './Landing';

const AvailableRoomSearch = () => <h2>AvailableRoomSearch</h2>;

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Layout>
            <Route exact={true} path='/' component={Landing} />
            <Route exact={true} path='/room-search' component={AvailableRoomSearch} />
          </Layout>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null)(App);
