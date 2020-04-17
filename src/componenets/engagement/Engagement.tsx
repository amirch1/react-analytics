import React from 'react';
import DateRange from '../shared/date-range/DateRange';
import './Engagement.scss';
import { Config } from "../../Analytics";

interface Props{
    config: Config;
}

function Engagement(props : Props) {
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
