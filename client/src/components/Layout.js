import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import {
  IconButton, Hidden, Drawer, Divider, CssBaseline, MenuList, MenuItem
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ChevronLeft } from '@material-ui/icons';

import Header from './Header';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  drawerPaper: {
    width: 240,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

const menuItems = [
  { label: 'Available Room Search', route: '/search/new', disabled: false },
  { label: 'Room Schedule Explorer', route: '/room-schedule', disabled: true },
  { label: 'Course Schedule Explorer', route: '/course-schedule', disabled: true }
];

class Layout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileOpen: false
    };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  renderMenuItems() {
    return (
      menuItems.map((item) => {
        return (
          <div key={item.route}>
            <MenuItem
              style={ { whiteSpace: 'normal' } }
              component={Link}
              to={item.route}
              disabled={item.disabled}
              selected={item.route === this.props.location.pathname}
            >
              {item.label} {item.disabled ? '(Coming Soon)' : ''}
            </MenuItem>
            <Divider />
          </div>
        );
      })
    );
  }

  renderDrawer() {
    return (
      <div>
        <div className={this.props.classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        </div>
        <MenuList>
          {this.renderMenuItems()}
        </MenuList>
      </div>
    );
  }

  render() {
    const { classes, children } = this.props;

    return (
      <Fragment>
        <CssBaseline/>
        <div className={classes.root}>
          <Header handleDrawerToggle={this.handleDrawerToggle} />
          <Hidden mdUp>
            <Drawer
              variant='temporary'
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
            >
              {this.renderDrawer()}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation='css'>
            <Drawer variant='permanent' open classes={{ paper: classes.drawerPaper }} >
              {this.renderDrawer()}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            <div className={classes.drawerHeader} />
            { children }
          </main>
        </div>
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(Layout);
