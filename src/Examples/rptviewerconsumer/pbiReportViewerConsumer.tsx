// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Checkbox, PrimaryButton, Fabric, IStackTokens, mergeStyles, mergeStyleSets, Stack, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import PBIReportViewer from '../../libs/pbireportviewer/reportViewer';

import 'react-toastify/dist/ReactToastify.css';
import { IReportAttributes } from '../../libs/types/IReportAttributes';
import { IFiletrSettings, IEmbedSettings } from '../../libs/types/IReportviewerProperties'
import { useEffect } from 'react';
const Consumer = () => {
    const RowSize = 5;

    const classNames = mergeStyleSets({
        controlWrapper: {
            borderTop: '1px solid black',
            display: 'flex',
            flexWrap: 'wrap',
        },
        detailsDiv: {
            border: '1px solid black',
            marginTop: '100px',
            marginBottom: '5px'
        },
        detailsValues: {
            color: '#0078d4'
        },
        checkbox: {
            width: '200px'
        },
        Text: {
            width: '350px'
        }
    });

    const gapStackTokens: IStackTokens = {
        childrenGap: 5,
        padding: 0,
    };
    const gapStackTokens1: IStackTokens = {
        childrenGap: 5,
        padding: 0,
    };

    const iconClass = mergeStyles({
        fontSize: 20,
        margin: "0px 0px 0px 30px"
    });

    const [CurrentReport1, setCurrentReport1] = useState<IReportAttributes>();
    const [fevReport1, setfevReport1] = useState<IReportAttributes[]>([]);
    const [accessToken1, setAccessToken1] = useState<string>('');

    const [CurrentReport, setCurrentReport] = useState<IReportAttributes>();
    const [fevReport, setfevReport] = useState<IReportAttributes[]>([]);
    const [accessToken, setAccessToken] = useState<string>('');

    const [embedSettings, setEmbedSettings] = useState<IEmbedSettings>();
    const [filterSettings, setFilterSettings] = useState<IFiletrSettings>();
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [filterExpnd, setfilterExpand] = useState<boolean>(false);
    const [showBackBtn, setShowBackBtn] = useState<boolean>(false);
    const [showCmdBar, setShowcmdBar] = useState<boolean>(false);
    const [showRptFilter, setShowRptFilter] = useState<boolean>(false);
    const [btnDisabled, setBtnDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (CurrentReport1) {
            var CurrentReport11: IReportAttributes = { ...CurrentReport1 };
            setCurrentReport(CurrentReport11);
        }
    }, [CurrentReport1]);

    useEffect(() => {
        if (fevReport1) {
            var fevReport11: IReportAttributes[] = [...fevReport1]
            setfevReport(fevReport11)
        }
    }, [fevReport1]);

    useEffect(() => {
        if (accessToken1) {
            setBtnDisabled(false);
        }
    }, [accessToken1])

    const SetDummyData = (): void => {

        var CurrentReport11: IReportAttributes = { ...CurrentReport1 };
        setCurrentReport(CurrentReport11);

        var fevReport11: IReportAttributes[] = [...fevReport1]
        setfevReport(fevReport11)

        var embedSetting: IEmbedSettings = {
            showReportFilter: showRptFilter,
            commandbarHidden: showCmdBar
        }

        var filterSetting: IFiletrSettings = {
            showBackButton: showBackBtn,
            filterExpanded: filterExpnd
        }
        setEmbedSettings(embedSetting);
        setFilterSettings(filterSetting);

    }

    function onReportLoad() {
        SetDummyData();
        if (accessToken1) {
            setAccessToken(accessToken1);
        }
    }

    function onReportSelection(data: any) {
        console.log(data)
    }

    function onSaveReportPreferences(data: any) {
        console.log(data);
    }

    function onAccesstokenChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        if (newValue)
            setAccessToken1(newValue);
    }

    function onReportConfigChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        try {
            if (newValue) {
                var CurrentReport11: IReportAttributes = JSON.parse(newValue);
                setCurrentReport1(CurrentReport11);
            }
        }
        catch (ex) {

        }
    }

    function onfevReportConfigChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        try {
            if (newValue) {
                var favport11: IReportAttributes[] = JSON.parse(newValue);
                setfevReport1(favport11);
            }
        }
        catch (ex) {

        }
    }

    function onShowFilterChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
        setShowFilter(isChecked);
        SetDummyData();
    }

    function onFilterExpndChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
        setfilterExpand(isChecked);
        SetDummyData();
    }

    function onShowBackBtnChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
        setShowBackBtn(isChecked);
        SetDummyData();
    }

    function onShowCmdBarChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
        setShowcmdBar(isChecked);
        SetDummyData();
    }

    function onRptFilterChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
        setShowRptFilter(isChecked);
        SetDummyData();
    }

    return (
        <Fabric>
            <fieldset className={classNames.detailsDiv}>
                <legend><b>Config Settings</b></legend>
                <Stack tokens={gapStackTokens1}>
                    <Stack.Item>
                        <Stack horizontal tokens={gapStackTokens}>
                            <Stack.Item className={classNames.checkbox}>
                                <Checkbox id={"showFilter"} label="Hide Filter" defaultIndeterminate onChange={onShowFilterChange} />
                            </Stack.Item>
                            <Stack.Item className={classNames.checkbox}>
                                <Checkbox id={"expndFilter"} label="Filter Expanded" defaultIndeterminate onChange={onFilterExpndChange} />
                            </Stack.Item>
                            <Stack.Item className={classNames.checkbox}>
                                <Checkbox id={"showBackBtn"} label="Hide Back Button" defaultIndeterminate onChange={onShowBackBtnChange} />
                            </Stack.Item>
                            <Stack.Item className={classNames.checkbox}>
                                <Checkbox id={"showCommandBar"} label="Hide Commandbar" defaultIndeterminate onChange={onShowCmdBarChange} />
                            </Stack.Item>
                            <Stack.Item className={classNames.checkbox}>
                                <Checkbox id={"showRptFlt"} label="Hide Report Filter" defaultIndeterminate onChange={onRptFilterChange} />
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>

                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal tokens={gapStackTokens}>
                            <Stack.Item className={classNames.Text}>
                                <TextField multiline resizable={false} id={"accessToken"} label="PBI Access Token" onChange={onAccesstokenChange}></TextField>
                            </Stack.Item>
                            <Stack.Item className={classNames.Text}>
                                <TextField multiline resizable={false} id={"rptConfig"} label="Report Config" onChange={onReportConfigChange}></TextField>
                            </Stack.Item>
                            <Stack.Item className={classNames.Text}>
                                <TextField multiline resizable={false} id={"fevrptConfig"} label="Feveret Reports Config" onChange={onfevReportConfigChange}></TextField>
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <PrimaryButton onClick={onReportLoad} disabled={btnDisabled}>Load Report</PrimaryButton>
                    </Stack.Item>
                </Stack>

            </fieldset>
            <div className={classNames.controlWrapper}>
                <PBIReportViewer
                    ShowFilter={showFilter}
                    EmbedSettings={embedSettings}
                    FiletrSettings={filterSettings}
                    accessToken={accessToken}
                    inItReport={CurrentReport}
                    inItfavReports={fevReport}
                    onReportSelection={onReportSelection}
                    onSaveReportPreferences={onSaveReportPreferences}></PBIReportViewer>
            </div>

        </Fabric>
    );
};

export default Consumer;