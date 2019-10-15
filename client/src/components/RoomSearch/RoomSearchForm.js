import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { reduxForm, Field, Fields, formValueSelector } from 'redux-form';
import moment from 'moment';
import _ from 'lodash';

import {
  MenuItem,
  ListItemText,
  Checkbox,
  Chip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  FormControl,
  FormHelperText,
  Grid,
  Button,
  IconButton,
  InputAdornment
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Select } from '@blackbricksoftware/redux-form-material-ui';
import { ExpandMore, Search, AccessTime, Event } from '@material-ui/icons';
import { DatePicker, TimePicker } from 'material-ui-pickers';

import * as actions from '../../actions';

const formFields = {
  buildings: 'You must select at least one building',
  date: 'You must select a date',
  startTime: 'You must provide a start time',
  endTime: 'You must provide an end time'
};

const styles = theme => ({
  root: {
    boxSizing: 'content-box'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  selector: {
    width: '100%',
    maxWidth: 236
  },
  details: {
    width: 'calc(100% - 8px)'
  },
  gridCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing.unit * 3
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

class RoomSelectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: []
    };

    this.renderChips = this.renderChips.bind(this);
    this.renderDateFormatInput = this.renderDateFormatInput.bind(this);
    this.renderTimeFormatInput = this.renderTimeFormatInput.bind(this);
  }

  componentDidMount() {
    this.props.fetchBuildings();
  }

  renderChips(selected) {
    const { classes } = this.props;
    return (
      <div className={classes.chips}>
        {selected.map(value => (
          <Chip key={value} label={value} className={classes.chip} />
        ))}
      </div>
    );
  }

  renderMenuItems() {
    const { buildings, selectedBuildings } = this.props;

    return buildings.map(item => (
      <MenuItem value={item.buildingCode} key={item.buildingCode}>
        <Checkbox
          checked={
            !!(
              selectedBuildings && selectedBuildings.includes(item.buildingCode)
            )
          }
          color="primary"
        />
        <ListItemText primary={item.buildingCode} />
      </MenuItem>
    ));
  }

  renderValidationMessage = fieldName => fields => {
    const {
      meta: { error, touched }
    } = fields[fieldName];
    if (error && touched) {
      return <FormHelperText error>{error}</FormHelperText>;
    }
    return null;
  };

  renderDateFormatInput(field) {
    const {
      input,
      meta: { error, touched }
    } = field;
    return (
      <DatePicker
        format="MM/DD/YYYY"
        showTodayButton
        value={!input.value ? null : new Date(input.value)}
        onChange={input.onChange}
        error={error && touched}
        invalidDateMessage="Invalid Date Format! Use MM/DD/YYYY"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <Event />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    );
  }

  renderTimeFormatInput(field) {
    const {
      input,
      meta: { error, touched }
    } = field;
    return (
      <TimePicker
        showTodayButton
        todayLabel="now"
        value={!input.value ? null : new Date(input.value)}
        onChange={input.onChange}
        error={error && touched}
        invalidDateMessage="Invalid Time Format! Use hh:mm AM/PM"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <AccessTime />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    );
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({ expanded: expanded ? panel : [] });
  };

  render() {
    const {
      classes,
      selectedBuildings,
      selectedDate,
      selectedStartTime,
      selectedEndTime,
      handleSubmit,
      history
    } = this.props;
    const { expanded } = this.state;
    return (
      <div className={classes.root}>
        <form
          onSubmit={handleSubmit(values =>
            this.props.fetchAvailableBuildings(values, history)
          )}
        >
          <ExpansionPanel
            expanded={expanded.includes('locationPanel')}
            onChange={this.handlePanelChange(['locationPanel'])}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Grid container spacing={24}>
                <Grid item xs={4} className={classes.gridItem}>
                  <Typography className={classes.heading}>Location</Typography>
                </Grid>
                <Grid item xs={8} className={classes.gridItem}>
                  <Typography className={classes.secondaryHeading}>
                    {selectedBuildings && selectedBuildings.length > 0
                      ? `${selectedBuildings.length} Building(s) Selected`
                      : 'Select Buildings'}
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={24} className={classes.details}>
                <Grid item xs={4} />
                <Grid item xs={8}>
                  <FormControl className={classes.selector}>
                    <Field
                      name="buildings"
                      component={Select}
                      renderValue={this.renderChips}
                      format={value => value || []}
                      multiple
                      MenuProps={{
                        style: {
                          maxHeight: '500px'
                        }
                      }}
                    >
                      {this.renderMenuItems(selectedBuildings)}
                    </Field>
                    <Fields
                      names={Object.keys(formFields)}
                      component={this.renderValidationMessage(['buildings'])}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded.includes('datePanel')}
            onChange={this.handlePanelChange(['datePanel'])}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Grid container spacing={24}>
                <Grid item xs={4}>
                  <Typography className={classes.heading}>Date</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography className={classes.secondaryHeading}>
                    {selectedDate
                      ? moment(selectedDate).format('dddd, MMMM DD, YYYY')
                      : 'Select Date'}
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={24} className={classes.details}>
                <Grid item xs={4} />
                <Grid item xs={8}>
                  <FormControl className={classes.selector}>
                    <Field name="date" component={this.renderDateFormatInput} />
                    <Fields
                      names={Object.keys(formFields)}
                      component={this.renderValidationMessage(['date'])}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel
            expanded={expanded.includes('timePanel')}
            onChange={this.handlePanelChange(['timePanel'])}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Grid container spacing={24}>
                <Grid item xs={4}>
                  <Typography className={classes.heading}>Time</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography className={classes.secondaryHeading}>
                    {selectedStartTime && selectedEndTime
                      ? `${moment(selectedStartTime).format(
                          'h:mm A'
                        )} - ${moment(selectedEndTime).format('h:mm A')}`
                      : 'Select Start and End Time'}
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={24} className={classes.details}>
                <Grid item xs={4} className={classes.gridCenter}>
                  <Typography className={classes.secondaryHeading}>
                    Start Time
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl className={classes.selector}>
                    <Field
                      name="startTime"
                      component={this.renderTimeFormatInput}
                    />
                    <Fields
                      names={Object.keys(formFields)}
                      component={this.renderValidationMessage(['startTime'])}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4} className={classes.gridCenter}>
                  <Typography className={classes.secondaryHeading}>
                    End Time
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <FormControl className={classes.selector}>
                    <Field
                      name="endTime"
                      component={this.renderTimeFormatInput}
                    />
                    <Fields
                      names={Object.keys(formFields)}
                      component={this.renderValidationMessage(['endTime'])}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div className={classes.button}>
            <Button
              variant="extendedFab"
              color="primary"
              type="submit"
              onClick={() => {
                this.handlePanelChange([
                  'locationPanel',
                  'datePanel',
                  'timePanel'
                ])(null, true);
              }}
            >
              <Search className={classes.extendedIcon} />
              Search
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  _.forOwn(formFields, (error, fieldName) => {
    if (!values[fieldName] || values[fieldName].length === 0) {
      errors[fieldName] = error;
    }
  });

  if (values.startTime > values.endTime) {
    errors.endTime = 'End time needs occur after start time';
  }

  return errors;
}

function mapStateToProps(state) {
  const selector = formValueSelector('searchForm');
  return {
    selectedDate: selector(state, 'date'),
    selectedStartTime: selector(state, 'startTime'),
    selectedEndTime: selector(state, 'endTime'),
    selectedBuildings: selector(state, 'buildings'),
    buildings: state.buildings
  };
}

export default compose(
  reduxForm({ form: 'searchForm', validate }),
  connect(
    mapStateToProps,
    actions
  ),
  withStyles(styles),
  withRouter
)(RoomSelectForm);
