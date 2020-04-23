import React, {ReactNode} from 'react';
import classes from './AreaBlocker.module.scss';
import {Spin} from "antd";

interface Props {
    loading: Boolean,
    children: ReactNode
}

export default function (props: Props) {
    return (
        <>
            {props.children}
            {props.loading ?
                <div className={classes.areaBlocker}>
                    <Spin/>
                </div>
                : null}
        </>
    )
}
