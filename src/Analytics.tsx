import React, {useEffect, useState} from 'react';
import { KalturaEndUserReportInputFilter, KalturaPager, KalturaReportResponseOptions } from "kaltura-rxjs-client/api/types";
import {Route, useHistory, Redirect, Switch, useLocation} from 'react-router-dom';
import Engagement from "./componenets/engagement/Engagement";
import Geo from "./componenets/geo/Geo";
import Menu from "./componenets/menu/Menu";
import Login from "./componenets/login/Login";
import PageNotFound from "./componenets/404/404";
import { Locals } from "./componenets/shared/types/Locals";
import { ConfigProvider } from 'antd';

import enUS from 'antd/es/locale/en_US';
import deDE from 'antd/es/locale/de_DE';
import esES from 'antd/es/locale/es_ES';
import frFR from 'antd/es/locale/fr_FR';
import itIT from 'antd/es/locale/it_IT';

import classes from './Analytics.module.scss';

export interface Config {
    ks: string;
    permissions?: string[];
    locale: Locals;
}

export interface ReportConfig {
    pager: KalturaPager;
    filter: KalturaEndUserReportInputFilter;
    responseOptions: KalturaReportResponseOptions;
    sortOrder?: number;
}

export const ConfigContext = React.createContext<Config>({ks: '', locale: Locals.English});

function Analytics() {
    
    const [config, setConfig] = useState<Config>(() => {
        return {ks: '', permissions: [], locale: Locals.English};
    });
    
    const history = useHistory();
    const location = useLocation();
    
    useEffect(() => {
        const savedConfig = sessionStorage.getItem('react-analytics');
        if (savedConfig) {
            const {ks, locale} = JSON.parse(savedConfig);
            setConfig({ks, permissions: [], locale: locale});
            history.push(location.pathname);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const loginSuccess = (ks: string, locale: Locals, permissions = []) => {
        sessionStorage.setItem('react-analytics', JSON.stringify({ks, locale}));
        setConfig({ks, permissions, locale});
        history.push("/engagement");
    };
    
    const logout = () => {
        sessionStorage.removeItem('react-analytics');
        setConfig({ks: '', permissions: [], locale: Locals.English});
        history.push('/login');
    }
    
    const getLocale = () => {
        let locale = enUS;
        switch (config.locale) {
            case(Locals.French):
                locale = frFR;
                break;
            case(Locals.Spanish):
                locale = esES;
                break;
            case(Locals.German):
                locale = deDE;
                break;
            case(Locals.Italian):
                locale = itIT;
                break;
        }
        return locale;
    }
    
    return (
        <ConfigProvider locale={getLocale()}>
            <ConfigContext.Provider value={config}>
                <div className={classes.app}>
                    {config.ks.length ? <Menu onLogout={logout}/> : null }
                    <Switch>
                        <Route exact path="/" component={() => config.ks.length ? <Engagement config={config}/> : <Redirect to="/login"/>}/>
                        <Route exact path="/login" component={() => <Login onLogin={loginSuccess}/>}/>
                        <Route path="/engagement" component={() => <Engagement config={config} />}/>
                        <Route path="/geo" component={Geo}/>
                        <Route component={PageNotFound}/>
                    </Switch>
                </div>
            </ConfigContext.Provider>
        </ConfigProvider>
    );
}

export default Analytics;
