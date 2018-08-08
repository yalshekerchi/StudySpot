import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { reduxForm, Field, Fields, formValueSelector } from 'redux-form';
import moment from 'moment';
import _ from 'lodash';

import {
  MenuItem, ListItemIcon, Chip, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography,
  FormControl, FormHelperText, Grid, Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Select } from 'redux-form-material-ui';
import { ExpandMore, DomainRounded } from '@material-ui/icons';
import { DateFormatInput, TimeFormatInput } from 'material-ui-next-pickers';

import * as actions from '../../actions';
import formFields from './formFields';


const styles = theme => ({
  root: {
    maxWidth: 1000,
    boxSizing: 'content-box',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  buildingSelector: {
    width: '100%',
    maxWidth: 236
  },
  dateTimeSelector: {
    maxWidth: 236,
    boxSizing: 'content-box'
  },
  panelDetail: {
    paddingRight: '32px',
  },
  gridCenter: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing.unit * 3
  }
});

class RoomSelectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: null,
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
    return this.props.buildings.map((item) => {
      return (
        <MenuItem value={item.building_code} key={item.building_code}>
          <ListItemIcon>
            <DomainRounded />
          </ListItemIcon>
          {item.building_code}
        </MenuItem>
      );
    });
  }

  renderValidationMessage = fieldName => (fields) => {
    const { meta: { error, touched } } = fields[fieldName];
    if (error && touched) {
      return (
        <FormHelperText error>{error}</FormHelperText>
      );
    }
    return null;
  }

  renderDateFormatInput(field) {
    const { input, meta: { error, touched } } = field;
    const { classes } = this.props;
    return (
      <DateFormatInput
        onChange={input.onChange}
        value={!input.value ? null : new Date(input.value)}
        dateFormat='MM/dd/yyyy'
        okToConfirm={true}
        dialog={true}
        className={classes.dateTimeSelector}
        error={(touched && error) ? error : undefined}
      />
    );
  }

  renderTimeFormatInput(field) {
    const { input, meta: { error, touched } } = field;
    const { classes } = this.props;
    return (
      <TimeFormatInput
        onChange={input.onChange}
        value={!input.value ? null : new Date(input.value)}
        okToConfirm={true}
        dialog={true}
        className={classes.dateTimeSelector}
        error={(touched && error) ? error : undefined}
      />
    );
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({ expanded: expanded ? panel : false });
  }

  render() {
    const {
      classes, selectedBuildings, selectedDate, selectedStartTime, selectedEndTime, handleSubmit, invalid
    } = this.props;
    const { expanded } = this.state;
    return (
      <div className={classes.root}>
        <form onSubmit={handleSubmit(values => console.log(values))}>
          <ExpansionPanel expanded={expanded === 'locationPanel'} onChange={this.handlePanelChange('locationPanel')}>
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Grid container spacing={24}>
                <Grid item xs={4} className={classes.gridItem}>
                  <Typography className={classes.heading}>Location</Typography>
                </Grid>
                <Grid item xs={8} className={classes.gridItem}>
                  <Typography className={classes.secondaryHeading}>
                    {(selectedBuildings && selectedBuildings.length > 0) ? `${selectedBuildings.length} Building(s) Selected` : 'Select Buildings'}
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={24} className={classes.panelDetail}>
                <Grid item xs={4} />
                <Grid item xs={8}>
                  <FormControl className={classes.buildingSelector}>
                    <Field
                      name='buildings'
                      component={Select}
                      renderValue={this.renderChips}
                      format={value => value || []}
                      multiple
                    >
                      {this.renderMenuItems()}
                    </Field>
                    <Fields names={Object.keys(formFields)} component={this.renderValidationMessage('buildings')}/>
                  </FormControl>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'datePanel'} onChange={this.handlePanelChange('datePanel')}>
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Grid container spacing={24}>
                <Grid item xs={4}>
                  <Typography className={classes.heading}>Date</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography className={classes.secondaryHeading}>
                    {selectedDate ? moment(selectedDate).format('dddd, MMMM d, YYYY') : 'Select Date'}
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <Grid container spacing={24} className={classes.panelDetail}>
                <Grid item xs={4} />
                <Grid item xs={8}>
                  <Field
                    name='date'
                    component={this.renderDateFormatInput}
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel expanded={expanded === 'timePanel'} onChange={this.handlePanelChange('timePanel')}>
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Grid container spacing={24}>
                <Grid item xs={4}>
                  <Typography className={classes.heading}>Time</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography className={classes.secondaryHeading}>
                    {selectedStartTime && selectedEndTime
                      ? `${moment(selectedStartTime).format('h:mm A')} - ${moment(selectedEndTime).format('h:mm A')}` : 'Select Start and End Time'}
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <Grid container spacing={24} className={classes.panelDetail}>
                  <Grid item xs={4} className={classes.gridCenter}>
                    <Typography className={classes.secondaryHeading}>Start Time</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      name='startTime'
                      component={this.renderTimeFormatInput}
                    />
                  </Grid>
                  <Grid item xs={4} className={classes.gridCenter}>
                  <Typography className={classes.secondaryHeading}>End Time</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      name='endTime'
                      component={this.renderTimeFormatInput}
                    />
                  </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div className={classes.button}>
            <Button variant='contained' color='primary' type='submit'>
              Continue
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
  connect(mapStateToProps, actions),
  withStyles(styles)
)(RoomSelectForm);
