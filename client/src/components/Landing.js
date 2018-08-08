import React, { Component } from 'react';

import { Typography, Chip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { School } from '@material-ui/icons';

const styles = theme => ({
  root: {
    flex: '1 0 100%',
  },
  hero: {
    minHeight: '80vh',
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.type === 'light' ? theme.palette.primary.dark : theme.palette.primary.main,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: '.7rem',
    textIndent: '.7rem',
    fontWeight: theme.typography.fontWeightLight,
    [theme.breakpoints.only('xs')]: {
      fontSize: 28,
    },
    whiteSpace: 'nowrap',
  },
  headline: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit,
    maxWidth: 500,
    textAlign: 'center',
  },
  content: {
    paddingBottom: theme.spacing.unit * 8,
    paddingTop: theme.spacing.unit * 8,
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing.unit * 12,
    },
  },
  chip: {
    marginTop: theme.spacing.unit * 3,
  },
  logo: {
    margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 4}px`,
    width: '100%',
    height: '35vw',
    maxHeight: 200,
  }
});

class Landing extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.hero}>
        <div className={classes.content}>
          <School className={classes.logo} />
          <div className={classes.text}>
            <Typography
              variant='display2'
              align='center'
              component='h1'
              color='inherit'
              gutterBottom
              className={classes.title}
            >
              {'StudySpot'}
            </Typography>
            <Typography
              variant='headline'
              component='h2'
              color='inherit'
              gutterBottom
              className={classes.headline}
            >
              {'Quick, simple access to classroom information.'}
            </Typography>
            <Chip
              className={classes.chip}
              variant='outlined'
              color='primary'
              label='Select an option from the menu to begin!'
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Landing);
