import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components"
import { Loading } from '../App';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Toggle } from '@fluentui/react/lib/Toggle';
import { general_settings, surface, tab_lookup, surface_tabs, tab_name } from 'shared/types/admin';
import { Number } from '../utils/NumberInput';
import equal from "fast-deep-equal"

const Row = styled.div`
    display: flex;
    flex-direction: Row;
    gap: 1rem;
`

const DataRow = styled.div`
    display: flex;
    border-radius: 5px;
    flex-direction: Row;
    gap: 1rem;
    padding-left: 12px;
    padding-right: 12px;
`

export const default_settings: general_settings = {
    delay_ms: 50,
    series: false,
    tabs: {
        phone: { "manual": true, "modes": true, "editor": false, "schedule": false, "template": false, "admin": false, "docs": false, },
        tablet: { "manual": true, "modes": true, "editor": true, "schedule": true, "template": false, "admin": false, "docs": false, },
        computer: { "manual": true, "modes": true, "editor": true, "schedule": true, "template": true, "admin": true, "docs": true, },
    }
}

const surfaces: surface[] = ["computer", "tablet", "phone"]

const GeneralSettings: React.FC = () => {

    const [initial_settings, set_initial_settings] = useState<general_settings>()
    const [delay_ms, set_delay_ms] = useState<number>(10)
    const [tabs, set_tabs] = useState<surface_tabs>()
    const [series, set_series] = useState<boolean>()
    const [modified, set_modified] = useState(false)

    useEffect(() => {
        let canceled = false;
        (async () => {
            try {
                const res = await fetch("/api/settings/GENERAL")
                if (canceled) return
                let settings: general_settings = await res.json()
                if (canceled) return
                console.log("DB settings: ", settings)
                // previous state
                set_initial_settings(settings)
                if (settings === null) {
                    console.log("USING DEFAULT SETTINGS")
                    // current state
                    set_delay_ms(default_settings.delay_ms)
                    set_tabs(default_settings.tabs)
                    set_series(default_settings.series)
                } else {

                    // current state
                    set_delay_ms(settings.delay_ms)
                    set_tabs(settings.tabs)
                    set_series(settings.series)
                }
            } catch (err) {
                console.log("dB driver error: ", err)
            }
        })()
        return () => { canceled = true }
    }, [])

    useEffect(() => {
        set_modified(!equal(initial_settings, { tabs, series, delay_ms }))
    }, [initial_settings, tabs, series, delay_ms])

    const save = useCallback(async () => {
        if (typeof tabs === "undefined" ||
            typeof series === "undefined" ||
            typeof delay_ms === "undefined") {
            return
        }

        let canceled = false;
        const next = { "type": "GENERAL", tabs, series, delay_ms }
        await fetch("/api/settings/", {
            method: "POST",
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(next)
        })
        if (canceled) return
        set_initial_settings({ tabs, series, delay_ms })
        return () => canceled = true;
    }, [tabs, series, delay_ms])

    if (typeof tabs === "undefined" || typeof series === "undefined")
        return (<Loading />)

    return <div>
        <Row>
            <h2>General Settings</h2>
            <PrimaryButton
                label="Save"
                onClick={save}
                disabled={!modified}
                style={{ alignSelf: "flex-end", marginLeft: "auto" }}>Save</PrimaryButton>
        </Row>
        <Row style={{ alignItems: "flex-end" }}>
            <Number
                value={delay_ms}
                onChange={set_delay_ms}
                label="Cycle time (ms)"
                min={1} max={1000} />
            <Toggle
                label={`Render in ${series ? "series" : "parallel"}`}
                onChange={(ev: React.MouseEvent<HTMLElement>, checked?: boolean) =>
                    typeof checked !== "undefined" && set_series(checked)
                }
                checked={series}
            />
        </Row>
        <h3 style={{ marginTop: "1rem" }}>Tab visibility *</h3>
        {surfaces.map((s, i) =>
            <DataRow
                key={i}
                style={{ backgroundColor: (i % 2 ? "none" : "#dddddd") }}>
                <h3 style={{ minWidth: "5rem", alignSelf: "center" }}>{s}</h3>
                <Tabs
                    tabs={tabs[s]}
                    onChange={(t: tab_lookup) => {
                        const out: surface_tabs = { ...tabs };
                        out[s] = t
                        set_tabs(out)
                    }}
                />
            </DataRow>)}
        <p>*These settings only affect the tabs which appear at the top of he page. Each page can still be navigated to directly via it's URL, such as <span style={{ fontFamily: "monospace" }}>{window.location.href}</span></p>
    </div >
}

const TABS: (keyof tab_lookup)[] = [
    "manual",
    "modes",
    "editor",
    "schedule",
    "template",
    "admin",
    "docs",
];

interface TabProps {
    tabs: tab_lookup;
    onChange: { (t: tab_lookup): void };
}

const Tabs: React.FC<TabProps> = ({ tabs, onChange }) => {

    const _onChange = useCallback((t: tab_name) => {
        const out = { ...tabs }
        out[t] = !out[t];
        onChange(out)
    }, [tabs, onChange])

    return <>
        {TABS.map((t, i) => <Toggle
            onChange={() => _onChange(t)}
            key={i}
            label={t as string}
            checked={tabs[t]}
        />)}
    </>
}


export default GeneralSettings