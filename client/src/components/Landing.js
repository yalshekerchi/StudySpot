import React, { Component } from 'react';
import { compose } from 'recompose';

import { Typography, Chip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { School } from '@material-ui/icons';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

const styles = theme => ({
  root: {
    flex: '1 0 100%'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    color:
      theme.palette.type === 'light'
        ? theme.palette.primary.dark
        : theme.palette.primary.main
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    letterSpacing: '.7rem',
    textIndent: '.7rem',
    fontWeight: theme.typography.fontWeightLight,
    [theme.breakpoints.only('xs')]: {
      fontSize: 28
    },
    whiteSpace: 'nowrap'
  },
  headline: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit,
    maxWidth: 500,
    textAlign: 'center'
  },
  chip: {
    marginTop: '60px'
  },
  logo: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 4}px`,
    width: '100%',
    height: '35vw',
    maxHeight: 200
  }
});

class Landing extends Component {
  render() {
    const { classes, width } = this.props;
    const menuLocation = isWidthUp('md', width) ? 'on the left' : 'below';

    return (
      <div className={classes.container}>
        <School className={classes.logo} />
        <div className={classes.text}>
          <Typography
            variant="display2"
            align="center"
            component="h1"
            color="inherit"
            gutterBottom
            className={classes.title}
          >
            {'StudySpot'}
          </Typography>
          <Typography
            variant="headline"
            component="h2"
            color="inherit"
            gutterBottom
            className={classes.headline}
          >
            {'Quick, simple access to classroom information.'}
          </Typography>
          <Chip
            className={classes.chip}
            label={`Select an option from the menu ${menuLocation} to begin!`}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withWidth()
)(Landing);
