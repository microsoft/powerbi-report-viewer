export interface IReportAttributes {
    reportId: string,
    name : string,
    embedUrl?: string,
    isFav : boolean,
    webURL : string,
    bookmarks: IBookmarkAttributes[]
  }

  export interface IBookmarkAttributes {
    key : string,
    name: string,
    isDefault : boolean,
    reportId?: string,
    bookmarkState?: string,
  }
  