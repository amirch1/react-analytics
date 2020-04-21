import React, { useState } from 'react';
import { Card, Input, Button, Select, Spin } from 'antd';
import { KalturaClient } from 'kaltura-rxjs-client';
import { UserLoginByLoginIdAction } from "kaltura-rxjs-client/api/types";
import { analyticsConfig} from "../../configuration/analytics-config";
import { Locals } from "../shared/types/Locals";

import classes from './Login.module.scss';

interface Props{
    onLogin: (ks: string, locale: Locals) => void;
}

export default  function Login(props: Props) {
    const { Option } = Select;
    
    const [loginDetails, setLoginDetails] = useState({user: '', password: '', locale: Locals.English, loggingIn: false, error: null});
    
    const handleLocaleChange = (value: Locals) => {
        setLoginDetails({...loginDetails, locale: value});
    }
    const handleInputChange = (event: any) => {
        setLoginDetails({...loginDetails, [event.target.name]: event.target.value });
    }
    
    const login = () => {
        setLoginDetails({...loginDetails, loggingIn: true, error: null });
        
        const client = new KalturaClient({ clientTag: 'react-analytics', endpointUrl: analyticsConfig.baseUrl });
        client.request(
            new UserLoginByLoginIdAction({ loginId: loginDetails.user, password: loginDetails.password })
        ).subscribe(
            result => {
                props.onLogin(result, loginDetails.locale);
            },
            error => {
                setLoginDetails({...loginDetails, loggingIn: false, error: error.message });
            });
    };
    
    return (
        <div className={classes.loginScreen}>
            <Card title="Login" bordered={false} style={{ width: 550, height: 500, borderRadius: 6, padding: 24 }} headStyle={{ fontSize: 24, fontWeight: 700, color: '#333333'}}>
                <div className={classes.login}>
                    <Input size="large" className={classes.input} name="user" placeholder="User Name" onChange={handleInputChange}></Input>
                    <Input.Password size="large" className={classes.input} name="password" placeholder="Password" onPressEnter={() => login()} onChange={handleInputChange}></Input.Password>
                    <div className={classes.localeHolder}>
                        <span className={classes.label}>Language:</span>
                        <Select size="large" className={classes.localeSelector} defaultValue={Locals.English} onChange={handleLocaleChange}>
                            {Object.keys(Locals).map((locale, index) => <Option key={index} value={(Locals as any)[locale]}>{locale}</Option>)}
                        </Select>
                    </div>
                    
                    <Button disabled={!loginDetails.user.length || !loginDetails.password.length || loginDetails.loggingIn} type="primary" size="large" onClick={login} className={classes.loginBtn}>
                        {loginDetails.loggingIn ? (<Spin size="small"/>) : null}
                        <span className={classes.btnLabel}>Login</span>
                    </Button>
                    
                    <span className={classes.error}>{loginDetails.error}</span>
                    
                </div>
            </Card>
        </div>
    );
}
