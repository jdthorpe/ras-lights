import React from "react"
import { Routes, Route } from "react-router-dom"
import Manual from "./manual"
import Admin from "./admin/admin"
import Modes from "./modes"
import Editor from "./editor/editor"
import Template from "./template"
import Schedule from "./schedule/schedule";
import Docs from "./docs"
import { FourOhFour } from "./App"

export const Main: React.FC = () => {

    return (
        <Routes>
            <Route path="/manual" element={<Manual />} />
            <Route path="/modes" element={<Modes />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/template" element={<Template />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/docs/*" element={<Docs />} />
            <Route path="*" element={<FourOhFour />} />
        </Routes>
    )
}