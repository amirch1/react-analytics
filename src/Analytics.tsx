import React, {useState} from 'react';
import {Route, useHistory, Redirect, Switch} from 'react-router-dom';
import './Analytics.scss';
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

export interface Config {
    ks: string;
    permissions?: string[];
    locale: Locals;
}

export const ConfigContext = React.createContext<Config>({ks: '', locale: Locals.English});

function Analytics() {
    
    const history = useHistory();
    const [config, setConfig] = useState<Config>({ks: '', permissions: [], locale: Locals.English});
    
    const loginSuccess = (ks: string, locale: Locals, permissions = []) => {
        setConfig({ks, permissions, locale});
        history.push("/engagement");
    };
    
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
                <div className="App">
                    {config.ks.length ? <Menu/> : null }
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
