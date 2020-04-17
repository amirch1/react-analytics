import React, {useState} from 'react';
import {Route, useHistory} from 'react-router-dom';
import './Analytics.scss';
import Engagement from "./componenets/engagement/Engagement";
import Geo from "./componenets/geo/Geo";
import Menu from "./componenets/menu/Menu";
import Login from "./componenets/login/Login";
import {Locals} from "./componenets/shared/types/Locals";

export interface Config {
    ks: string;
    permissions?: string[];
    locale: Locals;
}

function Analytics() {
    
    const history = useHistory();
    
    const [config, setConfig] = useState<Config>({ks: '', permissions: [], locale: Locals.English});
    
    const loginSuccess = (ks: string, locale: Locals, permissions = []) => {
        setConfig({ks, permissions, locale});
        
        history.push("/engagement");
    };
    
    return (
        <div className="App">
            {config.ks.length ?
                <>
                    <Menu/>
                    <Route exact path="/" component={Login}/>
                    <Route path="/engagement" component={() => <Engagement config={config} />}/>
                    <Route path="/geo" component={Geo}/>
                </>
                :
                <Login onLogin={loginSuccess}></Login>
            }
        </div>
    );
}

export default Analytics;
