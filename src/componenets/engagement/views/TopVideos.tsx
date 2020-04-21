import React from 'react';
import {ReportConfig} from "../../../Analytics";

import classes from './TopVideos.module.scss';

interface Props{
    reportConfig: ReportConfig
}

export default function TopVideos(props: Props) {
    return (
        <div className={classes.topVideos}>
            <h2>Top Videos Report</h2>
        </div>
    )
}
