import { IReportAttributes } from "./IReportAttributes";

export interface IReportviewerProperties {
  accessToken: any,
  ShowFilter: boolean;
  FiletrSettings?: IFiletrSettings,
  EmbedSettings? : IEmbedSettings,
  inItReport? : IReportAttributes,
  inItfavReports? : IReportAttributes[],
  onReportSelection: any,
  onBackButtonClick?: any
  onSaveReportPreferences?: any
}

export interface IFiletrSettings {
  filterExpanded?: boolean,
  showBackButton?: boolean
}

export interface IEmbedSettings {
  commandbarHidden? : boolean,
  showReportFilter? : boolean
}