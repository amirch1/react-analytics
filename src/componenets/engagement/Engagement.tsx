import React, {useContext} from 'react';
import DateRange from '../shared/date-range/DateRange';
import './Engagement.scss';
import {ConfigContext, Config} from '../../Analytics';
import { Redirect } from 'react-router-dom';

interface Props{
    config: Config;
}

function Engagement(props : Props) {
    
    const config: Config = useContext(ConfigContext);
    
    return (
        <>
            { config.ks.length ?
                <div className="header">
                    <span className="title">Engagement</span>
                    <DateRange/>
                </div>
            : <Redirect to="/login"/> }
        </>
    );
}

export default Engagement;
