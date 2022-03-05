import React, { useState, useCallback, useEffect } from "react"
import styled from "styled-components"
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import { default_settings } from "./admin/general"
import { useNavigate, useLocation } from "react-router-dom"
import { isTablet, isMobile } from "react-device-detect"
import { general_settings, tab_lookup } from 'shared/types/admin';

// eslint-disable-next-line no-useless-escape
const re_segment = /^(\/[^\/]*)/

const Shadow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 20px;
    z-index: 999;
    box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
    padding: 8px;
    position: relative;
`

function default_tabs(): tab_lookup {
    if (window.location.hostname.endsWith("github.io")) {
        return {
            "manual": false,
            "modes": false,
            "editor": false,
            "schedule": false,
            "template": true,
            "admin": false,
            "docs": true,
        }
    } else {
        return get_tabs(default_settings)
    }
}

function get_tabs(x: general_settings): tab_lookup {
    if (isTablet) {
        return (x.tabs.tablet)
    } else if (isMobile) {
        return (x.tabs.phone)
    } else {
        return (x.tabs.computer)
    }
}

export function Nav() {

    // somewhat annoyingly, this must be nested within the <BrowserRouter> in
    // order to use the useNavigation and useLocation hooks
    const navigate = useNavigate()
    const location = useLocation()
    console.log("location: ", location)

    const [tabs, set_tabs] = useState<tab_lookup>(default_tabs)

    const onLinkClick = useCallback((item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) => {
        item && navigate(item.props.itemKey!)
    }, [navigate])

    useEffect(() => {
        if (window.location.hostname.endsWith("github.io")) {
            location.pathname === "/" && navigate("/docs")
            return
        }
        // pull in the stored settings 
        (async () => {
            const res = await fetch("/ras-lights/api/settings/GENERAL")
            const settings: general_settings | null = await res.json()
            if (settings === null) {
                set_tabs(get_tabs(default_settings))
            } else {
                set_tabs(get_tabs(settings))
            }
            location.pathname === "/" && navigate("/manual")
        })()

    }, [location.pathname, navigate])

    if (tabs === null || typeof tabs === "undefined")
        return <div>Loading</div>

    const match = location.pathname.match(re_segment)
    const selectedKey = match === null ? (window.location.hostname.endsWith("github.io") ? "/docs" : "/manual") : match[0]

    return (
        <>
            <Shadow>
                <h4 style={{ margin: "0.8rem 0 0.8rem 1rem" }}>Ras-Lights</h4>
                <Pivot selectedKey={selectedKey} onLinkClick={onLinkClick}>
                    {(tabs.manual || location.pathname === "/manual") &&
                        <PivotItem itemKey="/manual" headerText="Manual" />}
                    {(tabs.modes || location.pathname === "/modes") &&
                        <PivotItem itemKey="/modes" headerText="Modes" />}
                    {(tabs.editor || location.pathname === "/editor") &&
                        <PivotItem itemKey="/editor" headerText="Editor" />}
                    {(tabs.schedule || location.pathname === "/schedule") &&
                        <PivotItem itemKey="/schedule" headerText="Schedule" />}
                    {(tabs.docs || location.pathname === "/docs") &&
                        <PivotItem itemKey="/docs" headerText="Docs" />}
                    {(tabs.template || location.pathname === "/template") &&
                        <PivotItem itemKey="/template" headerText="Template" />}
                    {(tabs.admin || location.pathname === "/admin") &&
                        <PivotItem itemKey="/admin" headerText="Admin" />}
                </Pivot>
            </Shadow>
        </>
    );
}
