import React, { FC, useState, useEffect, useRef, ReactDOM } from "react";
import { initializeIcons } from 'office-ui-fabric-react';
import {
    Fabric,
} from "office-ui-fabric-react";
import {
    controlClass,
} from "./reportViewer.styles";
import ReportSelection from './reportSelection'
import ReportEmbed from "./reportEmbed";
import { IReportviewerProperties } from '../types/IReportviewerProperties'
import { IReportAttributes, IBookmarkAttributes } from '../types/IReportAttributes'

initializeIcons(/* optional base url */);
const PBIReportViewer: FC<IReportviewerProperties> = (props) => {
    const { accessToken, inItReport, inItfavReports , FiletrSettings, EmbedSettings } = props;
    const [CurrentReport, setCurrentReport] = useState<IReportAttributes>();
    const [accessToken1, setAccessToken] = useState<any>();
    const [favReports, setFavReports] = useState<IReportAttributes[]>([]);
   
    useEffect(() => {
        if (props && props.accessToken) {
            setAccessToken(props.accessToken);
        }
    }, [props, props.accessToken])

    useEffect(() => {
        if (props && props.inItReport) {
            setCurrentReport(props.inItReport);
        }
    }, [props, props.inItReport])

    useEffect(() => {
        if (props && props.inItfavReports) {
            setFavReports(props.inItfavReports);
        }
    }, [props, props.inItfavReports])

    //Save details

    const saveReportPreferencesData = async (data : any) => {
        if (data) {
            props.onSaveReportPreferences(data);
         }
    }

    function onReportSelection1(data: any) {
        setCurrentReport(data);
    }

    const renderMain = (): JSX.Element => {
        return (
            <Fabric>
                <div>
                    <div hidden={props.ShowFilter} className={controlClass.filtercontainer}>
                        <ReportSelection
                            accessToken={accessToken1}
                            filterExpanded={FiletrSettings?.filterExpanded}
                            showBackButton={FiletrSettings?.showBackButton}
                            onReportSelection={onReportSelection1}
                        />
                    </div>
                    <div className={controlClass.Embedcontainer}>
                        <ReportEmbed
                            accessToken={accessToken1}
                            commandbarHidden={EmbedSettings?.commandbarHidden}
                            inItReport={CurrentReport}
                            showReportFilter={EmbedSettings?.showReportFilter}
                            inItfavReports={favReports}
                            onSaveReportPreferences={saveReportPreferencesData} />
                    </div>
                </div>
            </Fabric >
        );
    };

    return renderMain();
};


export default PBIReportViewer;


