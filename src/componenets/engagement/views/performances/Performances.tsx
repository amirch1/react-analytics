import React, {useContext, useEffect, useState} from 'react';
import {Config, ConfigContext, ReportConfig} from "../../../../Analytics";
import {KalturaClient} from "kaltura-rxjs-client";
import {analyticsConfig} from "../../../../configuration/analytics-config";
import {ReportUtils} from "../../../shared/utils/report-utils";
import {notification, Tabs} from "antd";
import {KalturaReportType} from "kaltura-rxjs-client/api/types/KalturaReportType";
import {ReportGetGraphsAction} from "kaltura-rxjs-client/api/types/ReportGetGraphsAction";
import AreaBlocker from "../../../shared/area-blocker/AreaBlocker";
import {KalturaReportGraph} from "kaltura-rxjs-client/api/types/KalturaReportGraph";
import {LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip} from 'recharts';

import classes from './Performances.module.scss';

interface Props{
    reportConfig: ReportConfig
}

const reportType = KalturaReportType.userEngagementTimeline;
const metrics = ["count_loads","count_plays","unique_known_users","sum_time_viewed","avg_view_drop_off","avg_completion_rate"];
const colors = ['#487ADF','#31BEA6','#81CC6F','#E1962E','#9B64E6','#16A8D7'];
const { TabPane } = Tabs;
let graphs: KalturaReportGraph[] = [];

export default function Performances(props: Props) {
    
    const config: Config = useContext(ConfigContext);
    const ks = config.ks;
    
    const [loading, setLoading] = useState<boolean>(true);
    const [graphData, setGraphData] = useState<any[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<{key: string, color: string}>({key: "count_loads", color: colors[0]});
    
    useEffect(() => {
        const loadReport = () => {
            setLoading(true);
            const {filter, responseOptions} = props.reportConfig;
            const client = new KalturaClient({clientTag: 'react-analytics', endpointUrl: analyticsConfig.baseUrl});
            client.setDefaultRequestOptions({ks});
            client.request(
                new ReportGetGraphsAction({
                    reportType,
                    reportInputFilter: filter,
                    responseOptions
                })
            ).subscribe(
                result => {
                    graphs = ReportUtils.parseGraphs(result, metrics);
                    setGraphData(graphs);
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

    const onTabChange = (activeKey: string) => {
        setSelectedMetric({key: metrics[parseInt(activeKey)], color: colors[parseInt(activeKey)]});
        setGraphData([...graphData]); // refresh the data to trigger animation, no real need
    }
    
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active) {
            return (
                <div className={classes.tooltip}>
                    <span className={classes.label}>{`${label} : ${payload[0].value}`}</span>
                </div>
            );
        }
    }
    
    return (
        <div className={classes.performances}>
            <AreaBlocker loading={loading}>
                <span className={classes.title}>Performances</span>
                <Tabs defaultActiveKey="0" onChange={onTabChange}>
                    <TabPane tab="Impressions" key="0"></TabPane>
                    <TabPane tab="Plays" key="1"></TabPane>
                    <TabPane tab="Unique Viewers" key="2"></TabPane>
                    <TabPane tab="Minutes Viewed" key="3"></TabPane>
                    <TabPane tab="Drop Off Rate" key="4"></TabPane>
                    <TabPane tab="Avg. Completion Rate" key="5"></TabPane>
                </Tabs>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart width={600} height={300} data={graphData} margin={{top: 32, right: 24, left: 0, bottom: 8}}>
                            <XAxis dataKey="date"/>
                            <YAxis/>
                            <Tooltip content={CustomTooltip}/>
                            <Line animationDuration={300} type="monotone" dot={false} isAnimationActive={true} dataKey={selectedMetric.key} stroke={selectedMetric.color} strokeWidth="2"/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </AreaBlocker>
        </div>
    
    );
}
