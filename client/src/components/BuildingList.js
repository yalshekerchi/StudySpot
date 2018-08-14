import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { NavLink } from 'react-router-dom';
import GeoPattern from 'geopattern';

import {
  withStyles,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid
} from '@material-ui/core';

import * as actions from '../actions';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  media: {
    paddingBottom: 'calc(100% - 84px)'
  },
  content: {
    paddingBottom: '16px !important',
    textAlign: 'center'
  }
});

class BuildingList extends Component {
  renderBuildingItems(buildings) {
    const { classes } = this.props;

    return buildings.map(building => (
      <Grid item xs={6} sm={3} key={building.buildingCode}>
        <NavLink
          to={`/search/${building.buildingCode}`}
          style={{ textDecoration: 'none' }}
        >
          <Card>
            <CardMedia
              className={classes.media}
              image={GeoPattern.generate(building.buildingCode).toDataUri()}
            />
            <CardContent className={classes.content}>
              <Typography variant="headline">
                {building.buildingCode}
              </Typography>
              <Typography color="textSecondary">
                Rooms: {building.rooms.length}
              </Typography>
            </CardContent>
          </Card>
        </NavLink>
      </Grid>
    ));
  }

  render() {
    return (
      <div>
        <Grid container spacing={24}>
          {this.renderBuildingItems(this.props.availableBuildings)}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    availableBuildings: state.availableBuildings
  };
}

export default compose(
  connect(
    mapStateToProps,
    actions
  ),
  withStyles(styles)
)(BuildingList);
