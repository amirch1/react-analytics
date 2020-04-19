import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.scss';
import { Button } from "antd";

interface Props{
    onLogout: () => void;
}

function Menu(props: Props) {
    return (
        <div className="menu">
            <NavLink to="engagement" activeClassName="active">ENGAGEMENT</NavLink>
            <NavLink to="geo" activeClassName="active">GEO LOCATION</NavLink>
            <Button className="logout" onClick={() => props.onLogout()}>Logout</Button>
        </div>
    );
}

export default Menu;
