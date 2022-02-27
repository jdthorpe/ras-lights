import React from "react"
import { Routes, Route } from "react-router-dom"
import { FourOhFour } from "./App"
import loadable from '@loadable/component'

const Manual = loadable(() => import("./manual"))
const Admin = loadable(() => import("./admin/admin"))
const Modes = loadable(() => import("./modes"))
const Editor = loadable(() => import("./editor/editor"))
const Template = loadable(() => import("./template"))
const Schedule = loadable(() => import("./schedule/schedule"))
const Docs = loadable(() => import("./docs"))

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