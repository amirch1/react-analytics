import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from "antd";

import classes from './Menu.module.scss';

interface Props{
    onLogout: () => void;
}

function Menu(props: Props) {
    return (
        <div className={classes.menu}>
            <NavLink to="engagement" activeClassName={classes.active}>ENGAGEMENT</NavLink>
            <NavLink to="geo" activeClassName={classes.active}>GEO LOCATION</NavLink>
            <Button className={classes.logout} onClick={() => props.onLogout()}>Logout</Button>
        </div>
    );
}

export default Menu;
