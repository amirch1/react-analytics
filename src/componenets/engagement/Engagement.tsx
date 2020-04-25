import React, {useContext, useState} from 'react';
import DateRange from '../shared/date-range/DateRange';
import {ConfigContext, Config, ReportConfig } from '../../Analytics';
import { Redirect } from 'react-router-dom';
import { DateFilterUtils } from '../shared/utils/date-filter-utils';

import MiniHighlights from "./views/mini-highlights/MiniHighlights";
import TopVideos from "./views/top-videos/TopVideos";
import Performances from "./views/performances/Performances";

import { KalturaPager } from "kaltura-rxjs-client/api/types/KalturaPager";
import { KalturaReportInterval } from "kaltura-rxjs-client/api/types/KalturaReportInterval";
import { KalturaEndUserReportInputFilter } from "kaltura-rxjs-client/api/types/KalturaEndUserReportInputFilter";
import { KalturaReportResponseOptions } from "kaltura-rxjs-client/api/types/KalturaReportResponseOptions";

import {analyticsConfig} from "../../configuration/analytics-config";

import classes from './Engagement.module.scss';


interface Props{
    config: Config;
}

function Engagement(props : Props) {
    
    const config: Config = useContext(ConfigContext);
    
    const [reportConfig, setReportConfig] = useState<ReportConfig>(() => {
        const pager: KalturaPager = new KalturaPager({pageSize: 25, pageIndex: 1});
        const filter: KalturaEndUserReportInputFilter = new KalturaEndUserReportInputFilter({
            searchInTags: true,
            searchInAdminTags: false,
            timeZoneOffset: DateFilterUtils.getTimeZoneOffset(),
            interval: KalturaReportInterval.days,
            toDate: -1,
            fromDate: -1
        });
        const responseOptions: KalturaReportResponseOptions = new KalturaReportResponseOptions({
            delimiter: analyticsConfig.valueSeparator,
            skipEmptyDates: false
        });
        return {
            filter,
            pager,
            responseOptions
        }
    });
    
    const onDatesChange = (startDate: Date, endDate: Date) => {
        const filter: KalturaEndUserReportInputFilter = new KalturaEndUserReportInputFilter({
            ...reportConfig.filter,
            fromDate: DateFilterUtils.toServerDate(startDate, true),
            toDate: DateFilterUtils.toServerDate(endDate, false)
        });
        setReportConfig({
            filter,
            pager: reportConfig.pager,
            responseOptions: reportConfig.responseOptions
        });
    };
    
    return (
        <>
            { config.ks.length ?
                <div className={classes.engagement}>
                    <div className={classes.header}>
                        <span className={classes.title}>Engagement</span>
                        <div className={classes.dateRange}>
                            <DateRange onDatesChange={onDatesChange}/>
                        </div>
                    </div>
                    <MiniHighlights reportConfig={reportConfig}></MiniHighlights>
                    <Performances reportConfig={reportConfig}></Performances>
                    <TopVideos reportConfig={reportConfig}></TopVideos>
                </div>

            : <Redirect to="/login"/> }
        </>
    );
}

export default Engagement;
