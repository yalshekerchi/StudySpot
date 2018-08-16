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
  ListItemText
} from '@material-ui/core';
import { ExpandMore, Event } from '@material-ui/icons';

import * as actions from '../actions';

const styles = theme => ({
  root: {
    maxWidth: 1000,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
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

    return building.rooms.map(room => (
      <ListItem
        button
        key={room.roomNumber}
        onClick={() =>
          fetchRoom(building.buildingCode, room.roomNumber, pathname, history)
        }
      >
        <ListItemText primary={`${building.buildingCode} ${room.roomNumber}`} />
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
      location: { pathname },
      classes
    } = this.props;

    const building = pathname.startsWith('/search')
      ? availableBuilding
      : completeBuilding;

    if (building) {
      return (
        <div className={classes.root}>
          <Grid container direction="column" justify="center" spacing={24}>
            <Grid item xs={12}>
              {this.renderBuildingInfoPanel(building)}
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
  withStyles(styles)
)(BuildingDetail);
