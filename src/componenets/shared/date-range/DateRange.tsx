import React, {useEffect} from 'react';
import { DatePicker } from 'antd';

import moment from 'moment';

const { RangePicker } = DatePicker;

interface Props{
    onDatesChange: (startDate: Date, endDate: Date) => void;
}

const dateFormat = 'YYYY/MM/DD';
const today = new Date();
const startDate = moment(today, dateFormat).subtract(30, 'days');
const endDate = moment(today, dateFormat);

function DateRange(props: Props) {
    
    const {onDatesChange} = props;
    useEffect(() => {
        onDatesChange(startDate.toDate(), endDate.toDate());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const dateRangeChange = (dates: moment.Moment[]) => {
        props.onDatesChange(dates[0].toDate(), dates[1].toDate());
    }
    
    return (
        <RangePicker format={dateFormat} allowClear={false} defaultValue={[startDate, endDate]} onChange={(dates, dateStrings) => dateRangeChange(dates as moment.Moment[])} className="dateRange"/>
    );
}

export default DateRange;
