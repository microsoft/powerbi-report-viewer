import {IReportAttributes} from './IReportAttributes'

export interface IReportEmbedPros{
    accessToken?: string,
    commandbarHidden? : boolean,
    showReportFilter? : boolean,
    inItReport? : IReportAttributes,
    inItfavReports? : IReportAttributes[],
    onSaveReportPreferences?: any
}