import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { NavLink, withRouter } from 'react-router-dom';
import GeoPattern from '@dougmorin0/geopattern';

import {
  withStyles,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  InputBase,
  Paper
} from '@material-ui/core';
import { FilterList } from '@material-ui/icons';

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
  },
  filter: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    marginBottom: '24px'
  },
  filterIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    paddingTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 10,
    width: '100%'
  }
});

class BuildingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterTerm: ''
    };
  }

  handleInputChange(filterTerm) {
    this.setState({ filterTerm });
  }

  componentDidMount() {
    if (this.props.location.pathname.startsWith('/room-explorer')) {
      this.props.fetchBuildings();
    }
  }

  renderBuildingItems(buildings) {
    const {
      classes,
      location: { pathname }
    } = this.props;

    return buildings.map(building => (
      <Grid item xs={6} sm={3} key={building.buildingCode}>
        <NavLink
          to={`${pathname}/${building.buildingCode}`}
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
    const {
      allBuildings,
      availableBuildings,
      location: { pathname },
      classes
    } = this.props;

    const buildings = pathname.startsWith('/search')
      ? availableBuildings
      : allBuildings;

    const filterBuildings = buildings.filter(({ buildingCode }) => {
      return buildingCode
        .toLowerCase()
        .includes(this.state.filterTerm.toLowerCase());
    });

    return (
      <div>
        <Paper>
          <div className={classes.filter}>
            <div className={classes.filterIcon}>
              <FilterList />
            </div>
            <InputBase
              onChange={event => {
                this.handleInputChange(event.target.value);
              }}
              placeholder="Filter Buildings…"
              classes={{
                input: classes.input
              }}
            />
          </div>
        </Paper>
        <Grid container spacing={24}>
          {this.renderBuildingItems(filterBuildings)}
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allBuildings: state.buildings,
    availableBuildings: state.availableBuildings
  };
}

export default compose(
  connect(
    mapStateToProps,
    actions
  ),
  withStyles(styles),
  withRouter
)(BuildingList);
