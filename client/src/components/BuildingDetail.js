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
import { ExpandMore, LocalLibrary } from '@material-ui/icons';

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
  }
});

class BuildingDetail extends Component {
  constructor(props) {
    super(props);

    this.renderAvailableRoomsPanel = this.renderAvailableRoomsPanel.bind(this);
  }

  renderBuildingInfoPanel() {
    const { classes, building } = this.props;

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

  renderAvailableRoomsPanel() {
    const { classes } = this.props;

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography className={classes.heading}>Available Rooms</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>{this.renderRoomList()}</List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }

  renderRoomList() {
    const { building } = this.props;
    return building.rooms.map(room => (
      <ListItem key={room.roomNumber}>
        <ListItemIcon>
          <LocalLibrary />
        </ListItemIcon>
        <ListItemText primary={`${building.buildingCode} ${room.roomNumber}`} />
      </ListItem>
    ));
  }

  render() {
    const { classes, building } = this.props;
    if (building) {
      return (
        <div className={classes.root}>
          <Grid container direction="column" justify="center" spacing={24}>
            <Grid item xs={12}>
              {this.renderBuildingInfoPanel()}
            </Grid>
            <Grid item xs={12}>
              {this.renderAvailableRoomsPanel()}
            </Grid>
          </Grid>
        </div>
      );
    }
    return <div>Loading</div>;
  }
}

function mapStateToProps(state, ownProps) {
  const building = _.find(state.availableBuildings, {
    buildingCode: ownProps.match.params.code
  });
  return {
    building
  };
}

export default compose(
  connect(
    mapStateToProps,
    actions
  ),
  withStyles(styles)
)(BuildingDetail);
