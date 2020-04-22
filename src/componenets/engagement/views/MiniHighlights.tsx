import React, {useContext, useEffect, useState} from 'react';
import {Config, ConfigContext, ReportConfig} from "../../../Analytics";
import {KalturaReportType} from "kaltura-rxjs-client/api/types/KalturaReportType";
import {notification} from 'antd';
import {KalturaClient} from "kaltura-rxjs-client";
import {analyticsConfig} from "../../../configuration/analytics-config";
import {ReportGetTotalAction} from "kaltura-rxjs-client/api/types/ReportGetTotalAction";

import classes from './MiniHighlights.module.scss';
import AreaBlocker from "../../shared/area-blocker/AreaBlocker";

interface Props {
    reportConfig: ReportConfig
}

interface Highlights {
    count_plays: string;
    sum_time_viewed: string;
    unique_known_users: string;
    avg_view_drop_off: string;
    avg_completion_rate: string;
    count_loads: string;
}

const reportType = KalturaReportType.userEngagementTimeline;

export default function MiniHighlights(props: Props) {
    
    const config: Config = useContext(ConfigContext);
    const ks = config.ks;
    
    const [highlights, setHighlights] = useState<Highlights>(() => {
        return {
            count_plays: "",
            sum_time_viewed: "",
            unique_known_users: "",
            avg_view_drop_off: "",
            avg_completion_rate: "",
            count_loads: ""
        };
    });
    const [loading, setLoading] = useState<Boolean>(true);
    
    useEffect(() => {
        const loadReport = () => {
            setLoading(true);
            const client = new KalturaClient({clientTag: 'react-analytics', endpointUrl: analyticsConfig.baseUrl});
            client.setDefaultRequestOptions({ks});
            
            client.request(
                new ReportGetTotalAction({
                    reportType,
                    reportInputFilter: props.reportConfig.filter,
                    responseOptions: props.reportConfig.responseOptions
                })
            ).subscribe(
                result => {
                    const headers = result.header.split(props.reportConfig.responseOptions.delimiter);
                    const data = result.data.split(props.reportConfig.responseOptions.delimiter);
                    const parseData: any = {};
                    headers.forEach((header, index) => {
                        parseData[header] = (Math.round(parseFloat(data[index]) * 100) / 100).toString();
                    });
                    setHighlights(parseData as Highlights);
                    setLoading(false);
                },
                error => {
                    setLoading(false);
                    notification['error']({
                        message: 'Error',
                        duration: 0,
                        description: error.message
                    });
                });
        }
        if (props.reportConfig.filter.fromDate !== -1 && props.reportConfig.filter.toDate !== -1) {
            loadReport();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.reportConfig]);
    
    
    return (
        
        
        <div className={classes.miniHighlights}>
            <AreaBlocker loading={loading}>
                <h2>Highlights Report</h2>
                <div className={classes.row}>
                    <span className={classes.label}>Player Impressions:</span>
                    <span className={classes.value}>{highlights["count_loads"]}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.label}>Plays:</span>
                    <span className={classes.value}>{highlights["count_plays"]}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.label}>Unique Viewers:</span>
                    <span className={classes.value}>{highlights["unique_known_users"]}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.label}>Minutes Played:</span>
                    <span className={classes.value}>{highlights["sum_time_viewed"]}</span>
                </div>
            </AreaBlocker>
        </div>
    );
}
