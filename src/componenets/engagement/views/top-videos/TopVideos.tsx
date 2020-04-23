import React, {ReactNode, useContext, useEffect, useState} from 'react';
import {Config, ConfigContext, ReportConfig} from "../../../../Analytics";

import classes from './TopVideos.module.scss';
import {KalturaReportType} from "kaltura-rxjs-client/api/types/KalturaReportType";
import {ReportGetTableAction} from "kaltura-rxjs-client/api/types/ReportGetTableAction";
import {KalturaClient} from "kaltura-rxjs-client";
import {analyticsConfig} from "../../../../configuration/analytics-config";
import {notification, Table} from "antd";
import {KalturaFilterPager} from "kaltura-rxjs-client/api/types/KalturaFilterPager";
import {ReportUtils} from "../../../shared/utils/report-utils";

interface Props{
    reportConfig: ReportConfig
}

interface Column {
    title: string;
    dataIndex: string;
    key: string;
    render?: (text: string) => ReactNode;
}

interface TableRow {
    key: string;
    object_id: string;
    entry_name: string;
    count_plays: string;
    unique_known_users: string;
    avg_completion_rate: string;
    engagement_ranking: string;
}

const reportType = KalturaReportType.topContentCreator;
let columns: Column[] = [
    {
        title: 'Name',
        dataIndex: 'entry_name',
        key: 'entry_name'
    },
    {
        title: 'Plays',
        dataIndex: 'count_plays',
        key: 'count_plays',
        render: text => <div className={classes.play}><i className="icon-small-play"></i><span>{text}</span></div>
    },
    {
        title: 'Viewers',
        dataIndex: 'unique_known_users',
        key: 'unique_known_users',
        render: text => <div className={classes.viewer}><i className="icon-small-viewer-contributor"></i><span>{text}</span></div>
    },
    {
        title: 'Avg. Completion Rate',
        dataIndex: 'avg_completion_rate',
        key: 'avg_completion_rate',
        render: text => <div className={classes.completion}><i className="icon-small-time"></i><span>{text}</span></div>
    },
    {
        title: 'Score',
        dataIndex: 'engagement_ranking',
        key: 'engagement_ranking'
    }
];
export default function TopVideos(props: Props) {
    
    const config: Config = useContext(ConfigContext);
    const ks = config.ks;
    
    const [loading, setLoading] = useState<boolean>(true);
    const [dataSource, setDateSource] = useState<TableRow[]>([]);
    
    useEffect(() => {
        const loadReport = () => {
            setLoading(true);
            const {filter, pager, responseOptions} = props.reportConfig;
            const client = new KalturaClient({clientTag: 'react-analytics', endpointUrl: analyticsConfig.baseUrl});
            client.setDefaultRequestOptions({ks});
            client.request(
                new ReportGetTableAction({
                    reportType,
                    pager: pager as KalturaFilterPager,
                    reportInputFilter: filter,
                    responseOptions: responseOptions
                })
            ).subscribe(
                result => {
                    const headers = ['object_id','entry_name','status','creator_name','created_at','count_plays','unique_known_users','avg_completion_rate','engagement_ranking'];
                    const tableData = ReportUtils.parseTableData(result, headers);
                    let dataSource: TableRow[] = [];
                    tableData.forEach((row, index) => {
                       dataSource.push({
                           key: index.toString(),
                           object_id: row['object_id'],
                           entry_name: row['entry_name'],
                           count_plays: row['count_plays'],
                           unique_known_users: row['unique_known_users'],
                           avg_completion_rate: parseInt(row['avg_completion_rate']) > 100 ? '100%' : row['avg_completion_rate']+'%',
                           engagement_ranking: (Math.round(parseFloat(row['engagement_ranking']) * 100) / 100).toString() + ' / 10'
                       });
                    });
                    setDateSource(dataSource);
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
        <div className={classes.topVideos}>
            <span className={classes.title}>Top Videos</span>
            <Table loading={loading} dataSource={dataSource} columns={columns} />
        </div>
    )
}
