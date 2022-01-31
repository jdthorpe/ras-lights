import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components"
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { IDriver } from 'shared/types/admin';

const Row = styled.div`
    display: flex;
    flex-direction: Row;
    gap: 1rem;
`

const Driver: React.FC<{ driver?: IDriver }> = () => {

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/driver/")
                const driver = await res.json()
                console.log("DB driver: ", driver)
                set_delay_ms(driver)
                initial_set_delay_ms(driver)
            } catch (err) {
                console.log("dB driver error: ", err)
            }
        })()
    }, [])

    const [initial_delay_ms, initial_set_delay_ms] = useState<number>(10)
    const [delay_ms, set_delay_ms] = useState<number>(10)

    const save = useCallback(() => {
        fetch("/api/settings/", {
            method: "POST",
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "DELAY_MS": delay_ms })
        })
    }, [delay_ms])

    return <div>
        <Row style={{ alignItems: "flex-end" }}>
            <h2>Rendering</h2>
        </Row>
        <Row>
            <Number label="Cycle time (ms)" value={delay_ms} min={0} onChange={set_delay_ms} />
            <PrimaryButton
                label="Save"
                onClick={save}
                disabled={initial_delay_ms === delay_ms}
                style={{ alignSelf: "flex-end", marginLeft: "auto" }}>Save</PrimaryButton>
        </Row>
    </div >
}
export default Driver