import React, {useContext} from 'react';
import DateRange from '../shared/date-range/DateRange';
import './Engagement.scss';
import {ConfigContext, Config} from '../../Analytics';

interface Props{
    config: Config;
}

function Engagement(props : Props) {
    
    const conf: Config = useContext(ConfigContext);

    return (
        <>
            <div className="header">
                <span className="title">Engagement</span>
                <DateRange/>
            </div>

        </>
    );
}

export default Engagement;
