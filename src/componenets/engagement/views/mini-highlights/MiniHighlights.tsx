import React, {useContext, useEffect, useState} from 'react';
import {Config, ConfigContext, ReportConfig} from "../../../../Analytics";
import {KalturaReportType} from "kaltura-rxjs-client/api/types/KalturaReportType";
import {notification} from 'antd';
import {KalturaClient} from "kaltura-rxjs-client";
import {analyticsConfig} from "../../../../configuration/analytics-config";
import {ReportGetTotalAction} from "kaltura-rxjs-client/api/types/ReportGetTotalAction";

import classes from './MiniHighlights.module.scss';
import AreaBlocker from "../../../shared/area-blocker/AreaBlocker";
import {ReportUtils} from "../../../shared/utils/report-utils";

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
                    const totalsData = ReportUtils.parseTotals(result) as unknown;
                    setHighlights(totalsData as Highlights);
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
                <div className={classes.highlights}>
                    <div className={classes.col}>
                        <i className="icon-small-impressions" style={{'color': '#16a8d7'}}></i>
                        <span className={classes.value}>{highlights["count_loads"]}</span>
                        <span className={classes.label}>Player Impressions</span>
                    </div>
                    <div className={classes.col}>
                        <i className="icon-small-play" style={{'color': '#487adf'}}></i>
                        <span className={classes.value}>{highlights["count_plays"]}</span>
                        <span className={classes.label}>Plays</span>
                    </div>
                    <div className={classes.col}>
                        <i className="icon-viewer-contributor" style={{'color': '#31bea6'}}></i>
                        <span className={classes.value}>{highlights["unique_known_users"]}</span>
                        <span className={classes.label}>Unique Viewers</span>
                    </div>
                    <div className={classes.col}>
                        <i className="icon-small-time" style={{'color': '#e1962e'}}></i>
                        <span className={classes.value}>{highlights["sum_time_viewed"]}</span>
                        <span className={classes.label}>Minutes Played</span>
                    </div>
                    <div className={classes.col}>
                        <i className="icon-small-Completion-Rate" style={{'color': '#81cc6f'}}></i>
                        <span className={classes.value}>{highlights["avg_completion_rate"]}%</span>
                        <span className={classes.label}>Avg. Completion Rate</span>
                    </div>
                </div>
            </AreaBlocker>
        </div>
    );
}
