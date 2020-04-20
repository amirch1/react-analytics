import React, {useEffect} from 'react';
import {ReportConfig} from "../../../Analytics";

import './MiniHighlights.scss';

interface Props{
    reportConfig: ReportConfig
}

export default function MiniHighlights(props: Props) {
    
    useEffect(() => {
        if (props.reportConfig.filter.fromDate !== -1 && props.reportConfig.filter.toDate !== -1) {
            console.log("---> Load Report!");
            console.log("start date: " + props.reportConfig.filter.fromDate);
            console.log("end date: " + props.reportConfig.filter.toDate);
            console.log("pager: " + JSON.stringify(props.reportConfig.pager));
        }
    }, [props.reportConfig]);
    
    return (
        <h2>Highlights Report</h2>
    );
}
