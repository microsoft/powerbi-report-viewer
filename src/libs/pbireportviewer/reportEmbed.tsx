import React, { FC, useState, useEffect, useRef, ReactDOM } from "react";
import { IReportEmbedPros } from '../types/IReportEmbedPros';
import { IReportAttributes, IBookmarkAttributes } from '../types/IReportAttributes';
import { Dropdown, IDropdownOption, DropdownMenuItemType } from "office-ui-fabric-react/lib/Dropdown";
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { CommandBarButton, IButtonProps, IButtonStyles } from '@fluentui/react/lib/Button';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog';
import { Default, Divergent, Tidal, Executive, DarkTheme } from './themes/themes';
import { IIconProps, initializeIcons } from '@fluentui/react';
import {
    IconButton,
    PrimaryButton,
    DefaultButton,
    Stack,
    Link,
    Fabric,
    TextField,
    Text,
    DirectionalHint,
    Checkbox,
    Separator
} from "office-ui-fabric-react";
import {
    controlClass,
    stackTokens,
    stackTokens1,
} from "./reportViewer.styles";

import { useBoolean, useId } from '@fluentui/react-hooks';
import { PowerBIEmbed } from 'powerbi-client-react'
import { models, service, Report } from 'powerbi-client'

const ReportEmbed: FC<IReportEmbedPros> = (props) => {
    const { inItReport, accessToken, inItfavReports } = props;
    const [initload, setInItLoad] = useState<Boolean>(true);
    ////const themes: IReportTheme[] = useSelector(getreportThemes);
    const [themesCb, setthemesCb] = useState<ICommandBarItemProps[]>([]);

    const [CurrentReport, setCurrentReport] = useState<IReportAttributes>();
    const [currentReportObj, setCurrentReportObj] = useState<Report>();
    const [accessToken1, setAccessToken] = useState<string>('');

    const [ReportsList, setReportsList] = useState<IReportAttributes[]>([]);

    const [bookmarkState, setbookmarkState] = useState<string>('SingleBookmark');
    const [favoriteState, setfavoriteState] = useState<string>('FavoriteStar');
    const [filterState, setFilterState] = useState<string>('Filter');


    const [bookmarkName, setbookmarkName] = useState<string>('');
    const [bookmarkNameDisabled, setbookmarkNameDisabled] = useState<boolean>(false);
    const [reportBookmarksDd, setreportBookmarksDd] = useState<IDropdownOption[]>([]);
    const [reportBookmarksCb, setreportBookmarksCb] = useState<ICommandBarItemProps[]>([]);

    const [favReports, setFavReports] = useState<IReportAttributes[]>([]);
    const [favReportsCb, setFavReportsCd] = useState<ICommandBarItemProps[]>([]);

    useEffect(() => {
        if (props && inItReport) {
            setCurrentReport(inItReport);
        }
    }, [props, inItReport])

    useEffect(() => {
        if (props && accessToken) {
            setAccessToken(accessToken);
        }
    }, [props, accessToken])

    useEffect(() => {
        if (accessToken1) {
            onloadReport();
        }
    }, [accessToken1])

    useEffect(() => {
        if (inItfavReports) {
            setInItLoad(true);
            let fReports: IReportAttributes[] = [...inItfavReports];
            setFavReports(fReports);
        }
    }, [inItfavReports])

    useEffect(() => {
        if (CurrentReport) {
            onloadReport();
        }
    }, [CurrentReport])

    useEffect(() => {
        if (favReports) {
            loadDefaultReport();
            UpdateFevReportCB();
        }
    }, [favReports])

    function loadDefaultReport() {
        if (favReports) {
            if (initload) {
                let i = -1;
                //i = favReports.findIndex(f => f.isFav == true)[0];
                let j = i >= 0 ? i : 0;
                setCurrentReport(favReports[j]);
                setInItLoad(false);
            }
        }
    }

    function UpdateFevReportCB() {
        if (favReports) {
            let newfavReportsCb: ICommandBarItemProps[] = [];
            favReports.forEach(fr => {
                if (fr.isFav) {
                    let fevR: ICommandBarItemProps = {
                        key: fr.reportId,
                        name: fr.name,
                        onClick: () => { OnFevReportLoad(fr.reportId) }
                    }
                    newfavReportsCb.push(fevR);
                }
            });
            setFavReportsCd(newfavReportsCb);
        }
    }

    //Save details

    const saveReportPreferencesData = async () => {
        if (favReports) {
            let reportListtoSave = favReports.filter(r => r.isFav == true || (r.bookmarks && r.bookmarks.length > 0))
            if (reportListtoSave && reportListtoSave.length > 0)
                props.onSaveReportPreferences(reportListtoSave);
        }
    }

    function onloadReport() {
        if (CurrentReport) {
            CurrentReport.isFav ? setfavoriteState('Unfavorite') : setfavoriteState('FavoriteStar');
            resetCBButtonState();
            loadReportBookmarks();
            setReportConfig({
                ...reportConfig,
                id: CurrentReport.reportId,
                embedUrl: CurrentReport.embedUrl,
                accessToken: accessToken1,
            });
        }
    }


    function loadReportBookmarks() {
        if (CurrentReport) {
            let newBookmarksItemsCb: ICommandBarItemProps[] = []
            let newBookmarkItemsDd: IDropdownOption[] = [];
            let rbm = CurrentReport.bookmarks;
            if (rbm && rbm.length > 0) {
                rbm.forEach((bm) => {
                    if (bm.reportId == CurrentReport.reportId) {
                        let itemCb: ICommandBarItemProps = {
                            key: bm.key,
                            name: bm.name,
                            onClick: () => { onApplyBookmarkClick(bm.key) }
                        };
                        newBookmarksItemsCb.push(itemCb);

                        let itemDd: IDropdownOption = {
                            key: bm.key,
                            text: bm.name,
                            title: bm.name,
                        }
                        newBookmarkItemsDd.push(itemDd);
                    }
                });
            }
            setreportBookmarksCb(newBookmarksItemsCb);
            setreportBookmarksDd(newBookmarkItemsDd);
        }
    }

    //Report container and actions

    const [reportConfig, setReportConfig] = useState<models.IReportEmbedConfiguration>({
        type: 'report',
        id: '0000',
        embedUrl: 'https://msit.powerbi.com/reportEmbed',
        tokenType: models.TokenType.Aad,
        accessToken: '',
        settings: {
            panes: {
                filters: {
                    expanded: props.showReportFilter,
                    visible: props.showReportFilter
                },
                bookmarks: {
                    visible: false
                }
            },
            hideErrors: true,
            background: models.BackgroundType.Default,
        },
    },
    );

    // Map of event handlers to be applied to the embedding report
    const eventHandlersMap = new Map([
        ['loaded', function () {
            console.log('Report has loaded');
        }],
        ['rendered', function () {
            console.log('Report has rendered');

            // Update display message
            //setMessage('The report is rendered')
        }],
        ['error', function (event?: service.ICustomEvent<any>) {
            if (event) {
                console.log('error loading report/Auth issue');
                console.error(event.detail);
            }
        }]
    ]);


    function UpdateBookmarks(bms: IBookmarkAttributes[]) {

        if (bms && CurrentReport) {
            let newBookmarksItemsCb: ICommandBarItemProps[] = []
            let newBookmarkItemsDd: IDropdownOption[] = [];
            let newBookmarItems: IBookmarkAttributes[] = bms;

            bms.forEach((bm) => {
                if (bm.reportId == CurrentReport.reportId) {
                    let itemCb: ICommandBarItemProps = {
                        key: bm.key,
                        name: bm.name,
                        onClick: () => { onApplyBookmarkClick(bm.key) }
                    };
                    newBookmarksItemsCb.push(itemCb);

                    let itemDd: IDropdownOption = {
                        key: bm.key,
                        text: bm.name,
                        title: bm.name,
                    }
                    newBookmarkItemsDd.push(itemDd);
                }
            });

            setreportBookmarksCb(newBookmarksItemsCb);
            setreportBookmarksDd(newBookmarkItemsDd);
        }
    }

    const showBookmarksSettings = {
        panes: {
            bookmarks: {
                visible: true
            }
        }
    };
    const hideBookmarksSettings = {
        panes: {
            bookmarks: {
                visible: false
            }
        }
    };

    const showFiltersSettings = {
        panes: {
            filters: {
                expanded: true,
                visible: true
            }
        }
    };

    const hideFiltersSettings = {
        panes: {
            filters: {
                expanded: false,
                visible: false
            }
        }
    };

    async function onCreateBookmarkClick() {
        setbookmarkNameDisabled(false);
        toggleHideDialog();
    }

    async function onApplyBookmarkClick(key: string) {
        if (CurrentReport) {
            let bookMark = CurrentReport.bookmarks.filter(x => x.key === key);
            try {
                if (currentReportObj && bookMark && bookMark[0].bookmarkState) {
                    await currentReportObj.bookmarksManager.applyState(bookMark[0].bookmarkState);
                }
            }
            catch (e) {
                //console.log(e.error())
            }
        }
    }


    function resetCBButtonState() {
        setbookmarkState('SingleBookmark');
        setFilterState('Filter');
    }

    async function onAddUpdateBookmarkClick() {
        toggleHideDialog();
        try {
            if (currentReportObj) {
                UpdateBookmarkState('add');
            }
        }
        catch (e) {
            //console.log(e.error())
        }
    }

    async function UpdateBookmarkState(action: string) {
        try {
            if (currentReportObj && CurrentReport) {
                const loadedReportId = currentReportObj.getId();
                const capturedBookmark = await currentReportObj.bookmarksManager.capture();
                let newBookmarksItemsCb: ICommandBarItemProps[] = reportBookmarksCb;
                let newBookmarkItemsDd: IDropdownOption[] = reportBookmarksDd;
                let newBookmarItems: IBookmarkAttributes[] = []
                if (CurrentReport.bookmarks)
                    newBookmarItems = CurrentReport.bookmarks;
                let newfavReports: IReportAttributes[] = [...favReports];
                if (action === 'delete') {
                    let l = -1;
                    l = newBookmarItems.findIndex(x => x.name === reportIdSelectedBookmark);
                    newBookmarItems.splice(l, 1);
                    let m = -1;
                    m = newBookmarkItemsDd.findIndex(x => x.text === reportIdSelectedBookmark);
                    newBookmarkItemsDd.splice(m, 1);
                    let n = -1;
                    n = newBookmarksItemsCb.findIndex(x => x.text === reportIdSelectedBookmark);
                    newBookmarksItemsCb.splice(n, 1);
                }
                else {
                    if (action === 'update') {
                        let l = -1;
                        l = newBookmarItems.findIndex(x => x.name === reportIdSelectedBookmark);
                        newBookmarItems.splice(l, 1);
                        let m = -1;
                        m = newBookmarkItemsDd.findIndex(x => x.text === reportIdSelectedBookmark);
                        newBookmarkItemsDd.splice(m, 1);
                        let n = -1;
                        n = newBookmarksItemsCb.findIndex(x => x.text === reportIdSelectedBookmark);
                        newBookmarksItemsCb.splice(n, 1);
                    }


                    newBookmarksItemsCb.push({
                        key: capturedBookmark.name,
                        name: bookmarkName,
                        onClick: () => { onApplyBookmarkClick(capturedBookmark.name) }
                    });

                    let newDBBookmarkitem: any = {
                        key: capturedBookmark.name,
                        text: bookmarkName,
                        title: bookmarkName,
                    }
                    newBookmarkItemsDd.push(newDBBookmarkitem);

                    let newBookmarkitem: IBookmarkAttributes = {
                        key: capturedBookmark.name,
                        name: bookmarkName,
                        isDefault: false,
                        bookmarkState: capturedBookmark.state,
                        reportId: loadedReportId
                    }
                    newBookmarItems.push(newBookmarkitem);
                }
                let newCurrentReport: IReportAttributes = {
                    ...CurrentReport,
                    bookmarks: newBookmarItems
                };

                setreportBookmarksCb(newBookmarksItemsCb);
                setreportBookmarksDd(newBookmarkItemsDd);
                setCurrentReport(newCurrentReport);

                let j = -1;
                j = newfavReports.findIndex(x => x.reportId === CurrentReport.reportId);
                let newFavReportitem: IReportAttributes;
                if (j >= 0) {
                    newFavReportitem = {
                        ...newfavReports[j],
                        bookmarks: newBookmarItems
                    }
                    newfavReports.splice(j, 1);
                }
                else {
                    newFavReportitem = {
                        ...CurrentReport,
                        bookmarks: newBookmarItems
                    }
                }
                newfavReports.push(newFavReportitem);
                setFavReports(newfavReports);
                setbookmarkName('');

                //Save details to DB
                saveReportPreferencesData();
            }
        }
        catch (ex) {

        }
    }

    async function onGlobalBookmarksToggle() {
        try {
            if (currentReportObj) {
                if (bookmarkState === 'SingleBookmark') { //SingleBookmarkSolid
                    setbookmarkState('SingleBookmarkSolid')
                    await currentReportObj.updateSettings(showBookmarksSettings);
                }
                else {
                    setbookmarkState('SingleBookmark')
                    await currentReportObj.updateSettings(hideBookmarksSettings);
                }
            }
        }
        catch (e) {
            //console.log(e.error())
        }
    }

    const openPBIPortal = (): void => {

        if (CurrentReport && CurrentReport.webURL) {
            const newWindow = window.open(CurrentReport.webURL, '_blank', 'noopener,noreferrer')
            if (newWindow) newWindow.opener = null
        }
    }

    function onFullScreenClick() {
        try {
            if (currentReportObj) {
                currentReportObj.fullscreen();
            }
        }
        catch (e) {
            //console.log(e.error())
        }
    }

    function onRefreshReportClick() {
        try {
            if (currentReportObj) {
                currentReportObj.refresh();
            }
        }
        catch (e) {
            //console.log(e.error())
        }
    }

    async function onReportFilterToggle() {
        try {
            if (currentReportObj) {
                if (filterState === 'Filter') { //SingleBookmarkSolid
                    setFilterState('FilterSolid')
                    await currentReportObj.updateSettings(showFiltersSettings);
                }
                else {
                    setFilterState('Filter')
                    await currentReportObj.updateSettings(hideFiltersSettings);
                }
            }
        }
        catch (e) {
            //console.log(e.error())
        }
    }

    function OnFevReportLoad(key: string) {

        if (favReports) {
            let i = -1;
            i = favReports.findIndex(x => x.reportId === key);
            setCurrentReport(favReports[i]);
        }
    }

    function onAddRemoveFavoritesClick() {
        try {
            if (favoriteState === 'FavoriteStar') {
                if (currentReportObj && CurrentReport) {
                    setfavoriteState('Unfavorite');

                    let newfavReportsCb = favReportsCb;
                    let newfavReports = favReports;

                    let i = -1;
                    i = newfavReportsCb.findIndex(x => x.key === CurrentReport.reportId);
                    if (i < 0) {
                        newfavReportsCb.push({
                            key: CurrentReport.reportId,
                            name: CurrentReport.name,
                            onClick: () => { OnFevReportLoad(CurrentReport.reportId) }
                        });
                        setFavReportsCd(newfavReportsCb);
                    }
                    let j = -1;
                    j = newfavReports.findIndex(x => x.reportId === CurrentReport.reportId);
                    if (j < 0) {
                        let newFavReportitem: IReportAttributes = {
                            reportId: CurrentReport.reportId,
                            name: CurrentReport.name,
                            embedUrl: currentReportObj.config.embedUrl,
                            bookmarks: CurrentReport.bookmarks,
                            isFav: true,
                            webURL: CurrentReport.webURL
                        }
                        newfavReports.push(newFavReportitem);
                        setFavReports(newfavReports);
                    }
                    else {
                        let newFavReportitem: IReportAttributes = {
                            ...newfavReports[j],
                            isFav: true,
                        }
                        newfavReports.splice(j, 1);
                        newfavReports.push(newFavReportitem);
                        setFavReports(newfavReports);
                    }
                }
            }
            else if (favoriteState === 'Unfavorite') {
                if (CurrentReport) {
                    let newfavReportsCb = favReportsCb;
                    let newfavReports = favReports;
                    let i = -1;
                    i = newfavReportsCb.findIndex(x => x.key === CurrentReport.reportId);
                    newfavReportsCb.splice(i, 1);
                    let j = -1;
                    j = newfavReports.findIndex(x => x.reportId === CurrentReport.reportId && x.isFav);
                    newfavReports.splice(j, 1);
                    setFavReportsCd(newfavReportsCb);
                    setFavReports(newfavReports);
                    setfavoriteState('FavoriteStar');
                }
            }


            //Save details to DB
            saveReportPreferencesData();

        }
        catch (e) {
            //console.log(e.error())
        }
    }

    const [reportIdSelectedBookmark, setReportIdSelectedBookmark] = useState<string>('');
    function onExistingBookmarkSelect(event: React.FormEvent<HTMLDivElement>, option: IDropdownOption | undefined) {
        if (option === undefined) {
            return;
        }
        else {
            setReportIdSelectedBookmark(option.key.toString());
            setsaveUpdateBtnTxt('Update');
            if (CurrentReport && CurrentReport.bookmarks) {
                let i = -1;
                i = CurrentReport.bookmarks.findIndex(x => x.key === option.key.toString());
                if (i >= 0) {
                    setbookmarkName(CurrentReport.bookmarks[i].name);
                    setbookmarkNameDisabled(true);
                }
            }
        }
    }

    async function onThemeSelection(i: string) {
        try {
            if (currentReportObj) {
                if (i == 't0')
                    currentReportObj.resetTheme();
                else if (i == 't2')
                    currentReportObj.applyTheme({ themeJson: Tidal });
                else if (i == 't3')
                    currentReportObj.applyTheme({ themeJson: Divergent });
                else if (i == 't4')
                    currentReportObj.applyTheme({ themeJson: Executive });
                else if (i == 't5')
                    currentReportObj.applyTheme({ themeJson: DarkTheme });
            }
        }
        catch (e) {
            // console.log(e.error())
        }
    }

    function onBookmarkNameChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        if(newValue)
        setbookmarkName(newValue);
    }
    const overflowProps: IButtonProps = {
        ariaLabel: 'More commands',
        menuProps: {
            items: [], // CommandBar will determine items rendered in overflow
            isBeakVisible: true,
            beakWidth: 20,
            gapSpace: 10,
            directionalHint: DirectionalHint.topCenter,
        },
    };

    function fitToWidth() {
        if (currentReportObj) {
            currentReportObj.resizeActivePage(models.PageSizeType.Widescreen);
        }
    }

    useEffect(() => {
        if (reportConfig) {
            if (currentReportObj) {
                currentReportObj.configChanged(true);
            }

        }
    }, [reportConfig])

    function fitToPage() {
        if (currentReportObj) {
            currentReportObj.resizeActivePage(models.PageSizeType.Standard);
        }
    }

    const _items: ICommandBarItemProps[] = [
        {
            key: 'favoriteItems',
            text: 'My Favorites',
            iconProps: { iconName: 'FavoriteList' },
            subMenuProps: {
                items: favReportsCb
            },
        },
        {
            key: 'mybookmark',
            text: 'My Bookmarks',
            iconProps: { iconName: 'BookmarkReport' },
            subMenuProps: {
                items: reportBookmarksCb
            }
        },
        {
            key: 'theme',
            text: 'Select Theme',
            iconProps: { iconName: 'BucketColor' },
            subMenuProps: {
                items: //themesCb
                    [
                        { key: 'Default', text: 'Default', onClick: () => { onThemeSelection('t0') } },
                        { key: 'Tidal', text: 'Tidal', onClick: () => { onThemeSelection('t2') } },
                        { key: 'Divergent', text: 'Divergent', onClick: () => { onThemeSelection('t3') } },
                        { key: 'Executive', text: 'Executive', onClick: () => { onThemeSelection('t4') } },
                        { key: 'DarkTheme', text: 'DarkTheme', onClick: () => { onThemeSelection('t5') } },
                        // {
                        //   key: 'Contrast', text: 'Contrast Modes',
                        //   items: [
                        //     { key: 'HighContrast1', text: 'HighContrast1', onClick: () => { onThemeSelection('c1') } },
                        //     { key: 'HighContrast2', text: 'HighContrast2', onClick: () => { onThemeSelection('c2') } },
                        //     { key: 'HighContrastDark', text: 'HighContrastDark', onClick: () => { onThemeSelection('c3') } },
                        //     { key: 'HighContrastLight', text: 'HighContrastLight', onClick: () => {
                        //       console.log('c3');
                        //       loadedReport.applyTheme({ contrastMode : models.ContrastMode.HighContrast1 });
                        //       //setreportcontrastMode(models.ContrastMode.HighContrast1);
                        //       let newConfig = {
                        //         ...reportConfig,
                        //         id: SelectedReport.key.toString(),
                        //         embedUrl: SelectedReport.title,
                        //         accessToken: accessToken,
                        //         contrastMode: models.ContrastMode.HighContrast1
                        //       }
                        //       console.log(reportcontrastMode);
                        //       //setReportConfig(newConfig);
                        //       //loadedReport.config = newConfig;
                        //       loadedReport.render(newConfig);
                        //      }},
                        //     { key: 'NoContrast', text: 'Default', onClick: () => {
                        //       console.log('c0');
                        //       setreportcontrastMode(models.ContrastMode.HighContrastBlack);
                        //       let newConfig = {
                        //         ...reportConfig,
                        //         id: SelectedReport.key.toString(),
                        //         embedUrl: SelectedReport.title,
                        //         accessToken: accessToken,
                        //         contrastMode: models.ContrastMode.HighContrastBlack
                        //       }
                        //       console.log(reportcontrastMode);
                        //       //setReportConfig(newConfig);
                        //       //loadedReport.config = newConfig;
                        //       loadedReport.reload() //.render(newConfig);
                        //     }},
                        //   ]
                        // },
                    ],
            }
        }
    ];

    const _overflowItems: ICommandBarItemProps[] = [
        {
            key: 'fullscreen',
            text: 'Fullscreen',
            iconProps: { iconName: 'FullScreen' },
            onClick: () => { onFullScreenClick() },
        },
        { key: 'fittopage', text: 'Fit to page', onClick: () => { fitToPage() }, iconProps: { iconName: 'FitPage' } },
        { key: 'fitWidth', text: 'Fit to width', onClick: () => { fitToWidth() }, iconProps: { iconName: 'FitWidth' } },
        { key: 'gotoPBI', text: 'Go to PowerBI', onClick: () => { openPBIPortal() }, iconProps: { iconName: 'PowerBILogo' } },

    ];

    const _farItems: ICommandBarItemProps[] = [
        {
            key: 'addfevorite',
            text: 'Add to Fevorite',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Add to fevorite options',
            iconOnly: true,
            iconProps: { iconName: favoriteState },
            onClick: () => { onAddRemoveFavoritesClick() },
        },
        {
            key: 'createbookmark',
            text: 'Create Personal Bookmark',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Create personal Bookmark',
            iconOnly: true,
            iconProps: { iconName: 'AddBookmark' },
            onClick: () => { onCreateBookmarkClick() },
        },
        {
            key: 'globalbookmark',
            text: 'Global Bookmarks',
            // This needs an ariaLabel since it's icon-only
            ariaLabel: 'Global Bookmarks window',
            iconOnly: true,
            iconProps: { iconName: bookmarkState },
            onClick: () => { onGlobalBookmarksToggle() },
        },
        {
            key: 'filters',
            text: 'filters',
            ariaLabel: 'filters',
            iconOnly: true,
            iconProps: { iconName: filterState },
            onClick: () => { onReportFilterToggle() },
        },
        {
            key: 'refresh',
            text: 'refresh',
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: { iconName: 'Refresh' },
            onClick: () => { onRefreshReportClick() },
        },
        {
            key: 'info',
            text: 'Info',
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: { iconName: 'Info' },
            onClick: () => console.log('Info'),
        },
    ];
    const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
    const modelProps = {
        isBlocking: true,
        topOffsetFixed: true,
    };
    const dialogContentProps = {
        type: DialogType.largeHeader,
        title: 'Personal bookmark',
        subText: 'Give a name to save new bookmark',
    };

    function deleteBookmark() {
        if (CurrentReport) {
            UpdateBookmarkState('delete');
        }
    };

    function defaultBookmark() { console.log('default') };
    const [saveUpdateBtnTxt, setsaveUpdateBtnTxt] = useState<string>('Save');
    const emojiIcon: IIconProps = { iconName: 'Delete' };

    const renderMain = (): JSX.Element => {
        return (
            <Fabric>
                <Stack >
                    <Text variant="xLarge" className={controlClass.marginleft15} >{CurrentReport ? CurrentReport.name : "Selected Report Header"}</Text>
                    <div id="pbiEmbed">

                        <CommandBar
                            overflowButtonProps={overflowProps}
                            // Custom render all buttons
                            //buttonAs={CustomButton}
                            items={_items}
                            overflowItems={_overflowItems}
                            farItems={_farItems}
                            ariaLabel="Use left and right arrow keys to navigate between commands"
                            className={controlClass.commandbarStyles}
                            hidden={props.commandbarHidden}
                        />

                        <Dialog hidden={hideDialog} onDismiss={toggleHideDialog} modalProps={modelProps} dialogContentProps={dialogContentProps}>

                            <Stack horizontalAlign="start" horizontal tokens={stackTokens}>
                                <Stack.Item grow={1}>
                                    <Dropdown
                                        placeholder="My bookmarks"
                                        label="My bookmarks:"
                                        multiSelect={false}
                                        options={reportBookmarksDd}
                                        ariaLabel="My bookmarks:"

                                        onChange={onExistingBookmarkSelect}
                                    />
                                </Stack.Item>

                                <Stack.Item grow={1}>
                                    <IconButton iconProps={emojiIcon} title="Delete" ariaLabel="Delete" onClick={deleteBookmark} className={controlClass.submitStyles} />
                                </Stack.Item>

                            </Stack>

                            <TextField label="New Bookmark Name " required disabled={bookmarkNameDisabled} onChange={onBookmarkNameChange} maxLength={50} />
                            <DialogFooter>
                                <Stack horizontalAlign="start" horizontal tokens={stackTokens1}>
                                    <Stack.Item grow={1}>
                                        <Checkbox label="Default" onChange={defaultBookmark} className={controlClass.margintop5} />
                                    </Stack.Item>
                                    <Stack.Item grow={1}>
                                        <PrimaryButton onClick={onAddUpdateBookmarkClick} text={saveUpdateBtnTxt} />
                                    </Stack.Item>
                                    <Stack.Item grow={1}>
                                        <DefaultButton onClick={toggleHideDialog} text="Cancel" />
                                    </Stack.Item>
                                </Stack>
                            </DialogFooter>
                        </Dialog>

                        <PowerBIEmbed
                            embedConfig={reportConfig}
                            eventHandlers={eventHandlersMap}
                            cssClassName={controlClass.Embedcontainer}
                            getEmbeddedComponent={(embeddedReport) => {
                                setCurrentReportObj(embeddedReport as Report);
                            }}
                        />
                    </div>
                </Stack>
            </Fabric >
        );
    };

    return renderMain();
};

export default ReportEmbed;


