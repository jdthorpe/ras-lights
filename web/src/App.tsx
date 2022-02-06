import React, { useState, useCallback, useEffect } from "react"
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import Manual from "./manual"
import Admin from "./admin/admin"
import Modes from "./modes"
import Editor from "./editor/editor"
import Template from "./template"
import Schedule from "./schedule/schedule";
import { default_settings } from "./admin/general"
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom"
import { isTablet, isMobile } from "react-device-detect"
import { general_settings, tab_lookup } from 'shared/types/admin';

// gotta do it somewhere...
initializeIcons();

function Nav() {

  // somewhat annoyingly, this must be nested within the <BrowserRouter> in
  // order to use the useNavigation and useLocation hooks
  const navigate = useNavigate()
  const location = useLocation()

  const [tabs, set_tabs] = useState<tab_lookup>()

  const onLinkClick = useCallback((item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) => {
    item && navigate(item.props.itemKey!)
  }, [])

  useEffect(() => {

    (async () => {
      const res = await fetch("/api/settings/GENERAL")
      const settings: general_settings | null = await res.json()
      if (settings === null) {
        if (isTablet) {
          set_tabs(default_settings.tabs.tablet)
        } else if (isMobile) {
          set_tabs(default_settings.tabs.phone)
        } else {
          set_tabs(default_settings.tabs.computer)
        }
      } else {
        if (isTablet) {
          set_tabs(settings.tabs.tablet)
        } else if (isMobile) {
          set_tabs(settings.tabs.phone)
        } else {
          set_tabs(settings.tabs.computer)
        }
      }
      location.pathname === "/" && navigate("/manual")
    })()

  }, [])

  if (tabs === null || typeof tabs === "undefined")
    return <div>Loading</div>

  return (
    <Pivot selectedKey={location.pathname} onLinkClick={onLinkClick}>
      {(tabs.manual || location.pathname === "/manual") &&
        <PivotItem itemKey="/manual" headerText="Manual"><Manual /></PivotItem>}
      {(tabs.modes || location.pathname === "/modes") &&
        <PivotItem itemKey="/modes" headerText="Modes"><Modes /></PivotItem>}
      {(tabs.editor || location.pathname === "/editor") &&
        <PivotItem itemKey="/editor" headerText="Editor"><Editor /></PivotItem>}
      {(tabs.schedule || location.pathname === "/schedule") &&
        <PivotItem itemKey="/schedule" headerText="Schedule"><Schedule /></PivotItem>}
      {(tabs.template || location.pathname === "/template") &&
        <PivotItem itemKey="/template" headerText="Template"><Template /></PivotItem>}
      {(tabs.admin || location.pathname === "/admin") &&
        <PivotItem itemKey="/admin" headerText="Admin"><Admin /></PivotItem>}
    </Pivot>
  );
}

function App() {
  // bootstrap the router
  return <BrowserRouter>
    <Nav />
  </BrowserRouter>
}


export default App;
