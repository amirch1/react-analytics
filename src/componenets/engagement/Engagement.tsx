import React, {useContext, useState} from 'react';
import DateRange from '../shared/date-range/DateRange';
import {ConfigContext, Config, ReportConfig } from '../../Analytics';
import { Redirect } from 'react-router-dom';
import { DateFilterUtils } from '../shared/utils/date-filter-utils';
import MiniHighlights from "./views/MiniHighlights";

import './Engagement.scss';
import { KalturaPager } from "kaltura-rxjs-client/api/types/KalturaPager";
import { KalturaReportInterval } from "kaltura-rxjs-client/api/types/KalturaReportInterval";
import {KalturaEndUserReportInputFilter} from "kaltura-rxjs-client/api/types";

interface Props{
    config: Config;
}

function Engagement(props : Props) {
    
    const config: Config = useContext(ConfigContext);
    
    const [reportConfig, setReportConfig] = useState<ReportConfig>(() => {
        const pager: KalturaPager = new KalturaPager({pageSize: 500, pageIndex: 1});
        const filter: KalturaEndUserReportInputFilter = new KalturaEndUserReportInputFilter({
            searchInTags: true,
            searchInAdminTags: false,
            timeZoneOffset: DateFilterUtils.getTimeZoneOffset(),
            interval: KalturaReportInterval.days,
            toDate: -1,
            fromDate: -1
        });
        return {
            filter,
            pager,
        }
    });
    
    const onDatesChange = (startDate: Date, endDate: Date) => {
        const filter: KalturaEndUserReportInputFilter = new KalturaEndUserReportInputFilter({
            ...reportConfig.filter,
            toDate: DateFilterUtils.toServerDate(startDate, true),
            fromDate: DateFilterUtils.toServerDate(endDate, false)
        });
        setReportConfig({
            filter,
            pager: reportConfig.pager
        });
    };
    
    return (
        <>
            { config.ks.length ?
                <div className="engagement">
                    <div className="header">
                        <span className="title">Engagement</span>
                        <DateRange onDatesChange={onDatesChange}/>
                    </div>
                    <MiniHighlights reportConfig={reportConfig}></MiniHighlights>
                </div>

            : <Redirect to="/login"/> }
        </>
    );
}

export default Engagement;
