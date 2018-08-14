import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import _ from 'lodash';

import {
  Hidden,
  Drawer,
  ListItemText,
  CssBaseline,
  MenuList,
  AppBar,
  Toolbar,
  Typography,
  ListItem,
  ListItemIcon,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Divider
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Search, LocalLibrary, Class, School } from '@material-ui/icons';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  title: {
    letterSpacing: '.7rem',
    textIndent: '.7rem',
    fontWeight: theme.typography.fontWeightLight,
    fontSize: 28,
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  },
  drawerPaper: {
    width: 240,
    position: 'relative'
  },
  toolbar: {
    ...theme.mixins.toolbar
  },
  toolbarContent: {
    float: 'none',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - 240px)`,
      marginLeft: 240
    }
  },
  navBar: {
    width: '100%',
    position: 'fixed',
    bottom: '0%'
  },
  homeIcon: {
    color: 'white'
  }
});

const menuItems = [
  {
    label: 'Room Search',
    route: '/search',
    disabled: false,
    icon: <Search />
  },
  {
    label: 'Room Explorer',
    route: '/room-explorer',
    disabled: true,
    icon: <LocalLibrary />
  },
  {
    label: 'Course Explorer',
    route: '/course-explorer',
    disabled: true,
    icon: <Class />
  }
];

class Layout extends Component {
  renderMenuItems() {
    return menuItems.map((item, index) => (
      <div key={item.route}>
        <ListItem
          button
          component={Link}
          to={item.route}
          disabled={item.disabled}
          selected={index === this.props.pathindex}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
            primary={`${item.label} ${item.disabled ? '(Coming Soon)' : ''}`}
          />
        </ListItem>
      </div>
    ));
  }

  renderBottomNavigationActions() {
    return menuItems.map(item => (
      <BottomNavigationAction
        key={item.route}
        label={item.label}
        icon={item.icon}
        component={Link}
        to={item.route}
        disabled={item.disabled}
      />
    ));
  }

  render() {
    const {
      classes,
      children,
      location: { pathname }
    } = this.props;

    const pathIndex = _.findIndex(menuItems, [
      'route',
      `/${pathname.split('/')[1]}`
    ]);

    return (
      <Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar postition="absolute" className={classes.appBar}>
            <Toolbar>
              <div component={Link} to="/" className={classes.toolbarContent}>
                <Hidden smDown>
                  <Typography
                    component={Link}
                    to="/"
                    variant="display2"
                    align="center"
                    color="inherit"
                    className={classes.title}
                  >
                    {'StudySpot'}
                  </Typography>
                </Hidden>
                <Hidden mdUp>
                  <IconButton
                    component={Link}
                    to="/"
                    color="inherit"
                    style={{ fontSize: 40 }}
                  >
                    <School fontSize="inherit" />
                  </IconButton>
                </Hidden>
              </div>
            </Toolbar>
          </AppBar>
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              classes={{
                paper: classes.drawerPaper
              }}
            >
              <div className={classes.toolbar} />
              <Divider />
              <MenuList pathindex={pathIndex}>
                {this.renderMenuItems()}
              </MenuList>
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
            <div className={classes.toolbar} />
          </main>
          <Hidden mdUp>
            <BottomNavigation
              value={pathIndex}
              showLabels
              className={classes.navBar}
            >
              {this.renderBottomNavigationActions()}
            </BottomNavigation>
          </Hidden>
        </div>
      </Fragment>
    );
  }
}

export default compose(
  withRouter,
  withStyles(styles)
)(Layout);
