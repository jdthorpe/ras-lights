import React, { useCallback, useEffect } from "react"
import { Pivot, PivotItem } from '@fluentui/react';
import Manual from "./manual"
import Admin from "./admin/admin"
import Modes from "./modes"
import Editor from "./editor/editor"
import Template from "./template"
import Schedule from "./schedule/schedule";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { BrowserRouter, useNavigate, useLocation } from "react-router-dom"


initializeIcons();


function Nav() {

  // somewhat annoyingly, this must be nested within the <BrowserRouter> in
  // order to use the useNavigation and useLocation hooks
  const navigate = useNavigate()
  const location = useLocation()

  const onLinkClick = useCallback((item?: PivotItem, ev?: React.MouseEvent<HTMLElement>) => {
    item && navigate(item.props.itemKey!)
  }, [])
  useEffect(() => {
    location.pathname === "/" && navigate("/manual")
  }, [])


  return (
    <Pivot selectedKey={location.pathname} onLinkClick={onLinkClick}>
      <PivotItem itemKey="/manual" headerText="Manual">
        <Manual />
      </PivotItem>
      <PivotItem itemKey="/modes" headerText="Modes">
        <Modes />
      </PivotItem>
      <PivotItem itemKey="/header" headerText="Editor">
        <Editor />
      </PivotItem>
      <PivotItem itemKey="/schedule" headerText="Schedule">
        <Schedule />
      </PivotItem>
      <PivotItem itemKey="/template" headerText="Template">
        <Template />
      </PivotItem>
      <PivotItem itemKey="/admin" headerText="Admin">
        <Admin />
      </PivotItem>
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
