import React, { Component } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Menu } from '@material-ui/icons';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  }
});

class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar postition='absolute' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='Open drawer'
            onClick={this.props.handleDrawerToggle}
            className={classes.navIconHide}
          >
            <Menu />
          </IconButton>
          <Typography variant='title' color='inherit' noWrap>
            Menu
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
