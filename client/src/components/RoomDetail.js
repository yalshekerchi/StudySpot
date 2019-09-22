import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import moment from 'moment';
import _ from 'lodash';

import {
  withStyles,
  Card,
  Button,
  CardContent,
  Typography,
  CardActions,
  Grid,
  Tabs,
  Tab,
  Paper,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { ExpandMore } from '@material-ui/icons';

import * as actions from '../actions';

const styles = theme => ({
  root: {
    // Quick-fix: Find way to bound width
    width: 'calc(100vw - 32px - 16px)',
    [theme.breakpoints.up('md')]: {
      width: 'calc(100vw - 240px - 32px - 16px)',
      maxWidth: 1000
    },
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  card: {
    minWidth: 275
  },
  empty: {
    padding: theme.spacing.unit
  },
  time: {
    alignItems: 'center',
    display: 'flex'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  pos: {
    marginBottom: 12
  }
});

const dayItems = [
  {
    label: 'Monday',
    acronym: 'M'
  },
  {
    label: 'Tuesday',
    acronym: 'T'
  },
  {
    label: 'Wednesday',
    acronym: 'W'
  },
  {
    label: 'Thursday',
    acronym: 'Th'
  },
  {
    label: 'Friday',
    acronym: 'F'
  }
];

class RoomDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0
    };
  }

  componentDidMount() {
    const { room, roomNumber, buildingCode, fetchRoom } = this.props;
    if (!room) {
      fetchRoom(buildingCode, roomNumber);
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  renderRoomInfoPanel() {
    const { classes, room, buildingCode } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Room Details
          </Typography>
          <Typography variant="headline" component="h2">
            {buildingCode} {room.roomNumber}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Classes: {room.classes.length}</Button>
        </CardActions>
      </Card>
    );
  }

  renderRoomSchedulePanel() {
    const { width } = this.props;
    const { value } = this.state;

    return (
      <Paper>
        <Tabs
          value={value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          scrollButtons="on"
          centered={isWidthUp('lg', width)}
          variant={!isWidthUp('lg', width) ? 'scrollable' : 'fullWidth'}
        >
          {this.renderTabs()}
        </Tabs>
        {this.renderClassList()}
      </Paper>
    );
  }

  renderTabs() {
    return dayItems.map(day => <Tab key={day.acronym} label={day.label} />);
  }

  renderClassList() {
    const { classes, room } = this.props;
    const { value } = this.state;

    const dayClasses = _.chain(room.classes)
      .filter(classSlot => classSlot.day === dayItems[value].acronym)
      .sortBy('startTime')
      .value();

    if (!dayClasses.length) {
      return (
        <div className={classes.empty}>
          <br />
          <Typography color="textSecondary">
            No classes are scheduled for this day.
          </Typography>
          <br />
        </div>
      );
    }

    return dayClasses.map(classSlot => (
      <ExpansionPanel key={classSlot._id}>
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Grid container spacing={24}>
            <Grid item xs={4}>
              <Typography className={classes.heading}>
                {classSlot.section.subject} {classSlot.section.catalogNumber}
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.time}>
              <Typography className={classes.secondaryHeading}>
                {moment.utc(classSlot.startTime * 1000).format('hh:mm A')} -{' '}
                {moment.utc(classSlot.endTime * 1000).format('hh:mm A')}
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <Typography variant="headline" component="h2">
              {classSlot.section.title}
            </Typography>
            <Typography color="textSecondary" className={classes.pos}>
              {classSlot.section.section} ({classSlot.section.classNumber})
            </Typography>
            <Typography component="p">
              Instructor(s):{' '}
              {classSlot.instructors
                .map(
                  instructor =>
                    `${instructor.split(',')[1]} ${instructor.split(',')[0]}`
                )
                .join(', ')}
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ));
  }

  render() {
    const { room, classes } = this.props;
    if (room) {
      return (
        <div className={classes.root}>
          <Grid container justify="center" spacing={24}>
            <Grid item xs={12}>
              {this.renderRoomInfoPanel()}
            </Grid>
            <Grid item xs={12}>
              {this.renderRoomSchedulePanel()}
            </Grid>
          </Grid>
        </div>
      );
    }
    return <div>Loading</div>;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    buildingCode: ownProps.match.params.buildingCode,
    roomNumber: ownProps.match.params.roomNumber,
    room: Object.keys(state.room).length ? state.room : undefined
  };
}

export default compose(
  connect(
    mapStateToProps,
    actions
  ),
  withStyles(styles),
  withWidth()
)(RoomDetail);
