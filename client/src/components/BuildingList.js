import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import GeoPattern from 'geopattern';

import {
  withStyles, Card, CardMedia, CardContent, Typography, Grid
} from '@material-ui/core';

import * as actions from '../actions';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  media: {
    paddingBottom: 'calc(100% - 72px)'
  },
  content: {
    paddingBottom: '16px !important',
    textAlign: 'center'
  },
});

class BuildingList extends Component {
  renderBuildingItems(buildings) {
    const { classes } = this.props;

    return buildings.map(building => (
      <Grid item xs={6} sm={3}>
        <Card key={building.buildingCode}>
          <CardMedia
            className={classes.media}
            image={GeoPattern.generate(building.buildingCode).toDataUri()}
          />
          <CardContent className={classes.content}>
            <Typography variant="headline">
              {building.buildingCode}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Grid container spacing={24}>
          {this.renderBuildingItems(this.props.availableRooms)}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    availableRooms: state.availableRooms
  };
}

export default compose(
  connect(mapStateToProps, actions),
  withStyles(styles)
)(BuildingList);
