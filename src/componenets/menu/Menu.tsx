import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.scss';

function Menu() {
    return (
        <div className="menu">
            <NavLink to="engagement" activeClassName="active">ENGAGEMENT</NavLink>
            <NavLink to="geo" activeClassName="active">GEO LOCATION</NavLink>
        </div>
    );
}

export default Menu;
