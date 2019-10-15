import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import _ from 'lodash';

import {
  withStyles,
  Card,
  Button,
  CardContent,
  Typography,
  CardActions,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  withWidth
} from '@material-ui/core';
import { ExpandMore, Event } from '@material-ui/icons';

import * as actions from '../actions';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  card: {
    minWidth: 275
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  list: {
    width: '100%'
  },
  icon: {
    marginRight: 0
  },
  mapContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  map: {
    overflow: 'hidden',
    height: '75vh',
    width: '100%'
  },
  mapLink: {
    marginTop: '16px'
  },
  buttonLabel: {
    textAlign: 'center'
  }
});

class BuildingDetail extends Component {
  constructor(props) {
    super(props);
    this.renderAvailableRoomsPanel = this.renderAvailableRoomsPanel.bind(this);
  }

  componentDidMount() {
    const {
      completeBuilding,
      availableBuilding,
      location: { pathname },
      history,
      fetchBuildings
    } = this.props;

    if (pathname.startsWith('/search') && !availableBuilding) {
      history.push('/search');
    } else if (pathname.startsWith('/room-explorer') && !completeBuilding) {
      fetchBuildings();
    }
  }

  renderBuildingInfoPanel(building) {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Building Details
          </Typography>
          <Typography variant="headline" component="h2">
            {building.buildingName}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {building.buildingCode}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Available Rooms: {building.rooms.length}</Button>
        </CardActions>
      </Card>
    );
  }

  calculateMapStyles() {
    const { width } = this.props;
    switch (width) {
      case 'xs':
        return {
          border: 0,
          marginTop: '-65px',
          height: 'calc(75vh + 65px)'
        };
      case 'sm':
        return {
          border: 0,
          marginTop: '-70px',
          height: 'calc(75vh + 70px)'
        };
      case 'md':
        return {
          border: 0,
          marginTop: '-70px',
          height: 'calc(75vh + 70px)'
        };
      case 'lg':
        return {
          border: 0,
          marginTop: '-100px',
          height: 'calc(75vh + 100px)'
        };
      case 'xl':
        return {
          border: 0,
          marginTop: '-100px',
          height: 'calc(75vh + 100px)'
        };
      default:
        return {
          border: 0,
          marginTop: '-70px',
          height: 'calc(75vh + 70px)'
        };
    }
  }

  renderMapPanel(building) {
    const { classes } = this.props;

    const mapLink = `https://uwaterloo.ca/map/${building.buildingCode}`;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>Map</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.mapContainer}>
            <div className={classes.map}>
              <iframe
                src={mapLink}
                title="map"
                width="100%"
                id="mapiframe"
                style={this.calculateMapStyles()}
              />
            </div>
            <Button
              variant="outlined"
              color="primary"
              className={classes.mapLink}
              href={mapLink}
              size="small"
              classes={{ label: classes.buttonLabel }}
            >
              Powered by the official University of Waterloo Campus Map
            </Button>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  renderAvailableRoomsPanel(building) {
    const { classes } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>Available Rooms</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List className={classes.list}>{this.renderRoomList(building)}</List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  renderRoomList(building) {
    const {
      classes,
      fetchRoom,
      location: { pathname },
      history
    } = this.props;

    return building.rooms
      .sort((roomA, roomB) => roomA.roomNumber - roomB.roomNumber)
      .map(room => (
        <ListItem
          button
          key={room.roomNumber}
          onClick={() =>
            fetchRoom(building.buildingCode, room.roomNumber, pathname, history)
          }
        >
          <ListItemText
            primary={`${building.buildingCode} ${room.roomNumber}`}
          />
          <ListItemIcon className={classes.icon}>
            <Event />
          </ListItemIcon>
        </ListItem>
      ));
  }

  render() {
    const {
      completeBuilding,
      availableBuilding,
      location: { pathname }
    } = this.props;

    const building = pathname.startsWith('/search')
      ? availableBuilding
      : completeBuilding;

    if (building) {
      return (
        <div>
          <Grid container direction="column" justify="center" spacing={24}>
            <Grid item xs={12}>
              {this.renderBuildingInfoPanel(building)}
            </Grid>
            <Grid item xs={12}>
              {this.renderMapPanel(building)}
            </Grid>
            <Grid item xs={12}>
              {this.renderAvailableRoomsPanel(building, pathname)}
            </Grid>
          </Grid>
        </div>
      );
    }
    return <div>Loading</div>;
  }
}

function mapStateToProps(state, ownProps) {
  const availableBuilding = _.find(state.availableBuildings, {
    buildingCode: ownProps.match.params.buildingCode
  });
  const completeBuilding = _.find(state.buildings, {
    buildingCode: ownProps.match.params.buildingCode
  });
  return {
    completeBuilding,
    availableBuilding
  };
}

export default compose(
  connect(
    mapStateToProps,
    actions
  ),
  withStyles(styles),
  withWidth()
)(BuildingDetail);
