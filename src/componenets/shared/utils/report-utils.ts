import {KalturaReportTable, KalturaReportTotal} from "kaltura-rxjs-client/api/types";
import {analyticsConfig} from "../../../configuration/analytics-config";

export class ReportUtils {
    static parseTableData(table: KalturaReportTable, config: string[]): { [key: string]: string }[]  {
        // parse table columns
        let columns = table.header ? table.header.toLowerCase().split(analyticsConfig.valueSeparator) : [];
        const tableData: any[] = [];
        
        // parse table data
        if (table.data) {
            table.data.split(';').forEach(valuesString => {
                if (valuesString.length) {
                    let data: {[key: string]: any} = {};
                    valuesString.split(analyticsConfig.valueSeparator).forEach((value, index) => {
                        if (config.indexOf(columns[index]) > -1) {
                            data[columns[index]] = value;
                        }
                    });
                    tableData.push(data);
                }
            });
        }
        return tableData;
    }
    
    static parseTotals(totals: KalturaReportTotal): { [key: string]: string }  {
        const headers = totals.header.split(analyticsConfig.valueSeparator);
        const data = totals.data.split(analyticsConfig.valueSeparator);
        const parseData: any = {};
        headers.forEach((header, index) => {
            parseData[header] = (Math.round(parseFloat(data[index]) * 100) / 100).toString();
        });
        return parseData;
    }
    
}
