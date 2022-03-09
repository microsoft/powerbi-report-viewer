import React, { FC, useState, useEffect, useRef, ReactDOM } from "react";
import { IReportAttributes } from '../types/IReportAttributes';
import { IReportSelectionPros } from '../types/IReportSelectionPros';
import { Dropdown, IDropdownOption, DropdownMenuItemType } from "office-ui-fabric-react/lib/Dropdown";
import { IIconProps, initializeIcons } from '@fluentui/react';
import {
    Stack,
    Fabric,
    Separator,
    ActionButton
} from "office-ui-fabric-react";
import {
    controlClass,
    stackTokens,
    stackTokens1,
    dropdownStyles
} from "./reportViewer.styles";
import { httpGet } from "./helper/apiCalls";

const ReportSelection: FC<IReportSelectionPros> = (props: IReportSelectionPros) => {
    const { filterExpanded, accessToken, showBackButton } = props;
    const [accessToken1, setAccessToken] = useState<any>();
    const [WSsList, setWSsList] = useState<IDropdownOption[]>([]);
    const [AppsList, setAppsList] = useState<IDropdownOption[]>([]);
    const [WSnAppsList, setWSnAppsList] = useState<IDropdownOption[]>([]);
    const [ReportsListDd, setReportsListDd] = useState<IDropdownOption[]>([]);

    const [SelectedWSId, setSelectedWSId] = useState<IDropdownOption>();
    const [CurrentReport, setCurrentReport] = useState<IReportAttributes>();
    const [ReportsList, setReportsList] = useState<IReportAttributes[]>([]);

    const [expandBtnIconName, setexpandBtnIconName] = useState<string>('CollapseContentSingle');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [showBackBtn, setShowBackBtn] = useState<boolean>(true);
    const expandIcon: IIconProps = { iconName: expandBtnIconName };
    const backIcon: IIconProps = { iconName: 'NavigateBack' };

    useEffect(() => {
        if (accessToken) {
            setAccessToken(accessToken);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken1) {
            fetchAppsforUser();
            fetchWSforUser();
        }
    }, [accessToken1]);

    useEffect(() => {
        if (showBackButton)
            setShowBackBtn(!showBackButton);
        else
            setShowBackBtn(!showBackButton);
    }, [showBackButton])

    useEffect(() => {
        if (filterExpanded) {
            setShowFilter(!filterExpanded);
            setexpandBtnIconName('CollapseContentSingle');
        }
        else {
            setShowFilter(!filterExpanded)
            setexpandBtnIconName('ExploreContentSingle');
        }
    }, [filterExpanded])

    useEffect(() => {
        if (SelectedWSId) {
            fetchReportsforWS();
        }
    }, [SelectedWSId]);

    useEffect(() => {
        if (WSsList || AppsList) {
            loadWSnApps();
        }
    }, [WSsList, AppsList]);

    //Init fetches
    const fetchReportsforWS = async () => {
        let apiEndPoint = '';
        if (SelectedWSId && SelectedWSId.title === 'ws')
            apiEndPoint = `https://api.powerbi.com/v1.0/myorg/groups/${SelectedWSId.key}/reports`;
        else if (SelectedWSId && SelectedWSId.title === 'app')
            apiEndPoint = `https://api.powerbi.com/v1.0/myorg/apps/${SelectedWSId.key}/reports`;
        await httpGet(accessToken1, apiEndPoint, fetchReportsforUserSuccess, errorReportsCallBack);
    }

    const fetchReportsforUserSuccess = (response: any) => {
        let ResponseListDd = response.value.map((name: any) => ({
            key: name.id,
            text: name.name,
        }));
        setReportsListDd(ResponseListDd);

        let ResponseList = response.value.map((name: any) => ({
            reportId: name.id,
            name: name.name,
            embedUrl: name.embedUrl,
            webURL: name.webUrl
        }));
        setReportsList(ResponseList);
    }

    const errorReportsCallBack = (error: any) => {
        console.log("errorLoadReport" + error);
    }

    const fetchAppsforUser = async () => {
        //const auth = parentContext.getAuthContext();
        const apiEndPoint = "https://api.powerbi.com/v1.0/myorg/apps";
        await httpGet(accessToken1, apiEndPoint, fetchAppsforUserSuccess, errorAppsCallBack);
    }

    // function filterConfiguredApps(element, index, array) {
    //     return (element.text === 'Trade BI Insights');
    // }

    const fetchAppsforUserSuccess = (response: any) => {
        let ResponseList = response.value.map((name: any) => ({
            key: name.id,
            text: name.name,
            title: 'app',
        }));
        //let filteResponseList = ResponseList.filter(filterConfiguredApps);
        let filteResponseList = ResponseList;
        filteResponseList.unshift({ key: -2, text: "-", itemType: DropdownMenuItemType.Divider });
        filteResponseList.unshift({ key: -1, text: "Apps", itemType: DropdownMenuItemType.Header });
        setAppsList(filteResponseList);
    }

    const errorAppsCallBack = (error: any) => {
        console.log("AppsLoadError" + error);
    }

    const fetchWSforUser = async () => {
        const filter = "contains(name,'Trade BI Workspace')%20or%20contains(name,'TradeBI - Preview Workspace')%20or%20contains(name,'Global Trade Screening Platform-Bridger')";
        const apiEndPoint = "https://api.powerbi.com/v1.0/myorg/groups" // ?$filter=" + filter;
        await httpGet(accessToken1, apiEndPoint, fetchWSforUserSuccess, errorWSCallBack);
    };

    const fetchWSforUserSuccess = (response: any) => {
        let ResponseList = response.value.map((name: any) => ({
            key: name.id,
            text: name.name,
            title: 'ws',
        }));
        ResponseList.unshift({ key: -4, text: "-", itemType: DropdownMenuItemType.Divider });
        ResponseList.unshift({ key: -3, text: "Work Spaces", itemType: DropdownMenuItemType.Header });
        setWSsList(ResponseList);
    }

    const errorWSCallBack = (error: any) => {
        console.log("WSLoadError" + error);
    }

    const loadWSnApps = () => {
        let ResponseList = WSsList.map((name: IDropdownOption) => ({
            key: name.key,
            text: name.text,
            itemType: name.itemType,
            title: name.title,
        }));
        AppsList.forEach((item) => {
            let item1: any = {
                key: item.key,
                text: item.text,
                itemType: item.itemType,
                title: item.title,
            }
            ResponseList.push(item1);
        })
        setWSnAppsList(ResponseList);
    }

    //load report
    function onWSorAppSelectionChange(
        event: React.FormEvent<HTMLDivElement>,
        option: IDropdownOption | undefined
    ) {
        if (option === undefined) {
            console.log("no WS/App selected")
            return;
        }
        else {
            let selectedItem: any = option;
            setSelectedWSId(selectedItem);
        }
    }

    function onReportSelectionChange(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption | undefined) {
        if (option === undefined) {
            console.log("no Report selected")
            return;
        }
        else {
            if (ReportsList) {
                let i = -1;
                i = ReportsList.findIndex(x => x.reportId === option.key.toString());
                setCurrentReport(ReportsList[i]);

                if (props.onReportSelection) {
                    props.onReportSelection(ReportsList[i]);
                }
            }
        }
    }

    function OnNavigateBack() {
        if (props.onBackButtonClick) {
            props.onBackButtonClick();
        }
    }

    function expandColapseFilter() {
        if (showFilter) {
            setShowFilter(false);
            setexpandBtnIconName('CollapseContentSingle');
        }
        else {
            setShowFilter(true);
            setexpandBtnIconName('ExploreContentSingle');
        }
    };


    const renderMain = (): JSX.Element => {
        return (
            <Fabric>
                <Stack horizontalAlign="start" horizontal tokens={stackTokens} className={controlClass.optionsStyles1} >
                    <Stack.Item grow={1}>
                        <ActionButton split iconProps={expandIcon} allowDisabledFocus onClick={expandColapseFilter}>
                            Report Selection
                        </ActionButton>
                    </Stack.Item>
                    <Stack.Item grow={1}>
                        <Separator vertical />
                    </Stack.Item>
                    <Stack.Item grow={1}>
                        <div hidden={showBackBtn}>
                            <ActionButton split iconProps={backIcon} allowDisabledFocus onClick={OnNavigateBack}>
                                Back
                            </ActionButton>
                        </div>
                    </Stack.Item>
                </Stack>
                <div hidden={showFilter} >
                    <Stack horizontalAlign="start" horizontal tokens={stackTokens} className={controlClass.optionsStyles} >
                        <Stack.Item grow={1}>
                            <Dropdown
                                placeholder="Select a work space/App"
                                multiSelect={false}
                                options={WSnAppsList}
                                ariaLabel="Select a Work Space or App"
                                styles={dropdownStyles}
                                onChange={onWSorAppSelectionChange}
                            />
                        </Stack.Item>
                        <Stack.Item grow={1}>
                            <Dropdown
                                placeholder="Select a report"
                                multiSelect={false}
                                options={ReportsListDd}
                                ariaLabel="Select a Report"
                                styles={dropdownStyles}
                                onChange={onReportSelectionChange}
                            />
                        </Stack.Item>
                    </Stack>
                </div>
                <Separator />
            </Fabric >
        );
    };
    return renderMain();
};

export default ReportSelection;


