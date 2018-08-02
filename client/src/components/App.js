import React, { Component } from 'react';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    return (
      <div>
        Hello World
      </div>
    );
  }
}

export default connect(null)(App);
