import React, { useContext } from 'react';
import { DatePicker } from 'antd';
import './DateRange.scss';

function DateRange() {
    
    const { RangePicker } = DatePicker;
    
    return (
        <RangePicker className="dateRange"/>
    );
}

export default DateRange;
