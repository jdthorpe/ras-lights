import React, { useState, useEffect } from "react"
import equal from "fast-deep-equal"
import styled from "styled-components"

const Output = styled.div`
    margin: 0.6rem 0;
    background-color: #dddddd;
    padding:  4px 1rem;
    border-radius: 4px;
`

const PERIOD = 3000;
const COUNT = 5;

export const default_component: React.FC<{ name?: string }> = (props) => (<><div>Could no such special component "{props.name}"</div>{props.children}</>)

interface IProgress {
    index: number;  // ranges between 0 and count - 1
    cycle: number;  // Counts the number of times the timer has cycled through
}

function complex_timer(period = PERIOD, count = COUNT): { (): IProgress } {
    const start_time = +new Date();
    return () => {
        const delta = (+new Date() - start_time) / (period);
        const index = Math.floor(delta * count) % count;
        const cycle = Math.floor(delta);
        return { index, cycle };
    };
}

function zig_zag(period = PERIOD, range = COUNT) {
    const timer = complex_timer(period, range)

    return () => {
        const { index, cycle } = timer()
        const out = new Array(range)
        for (let j = 0; j < range; j++)
            out[j] = (cycle % 2) ^ +(j % range > index)
        return out;
    }
}
/*
function effect(this: any, x: input, globals: globals): rgb[] {
    // initialization
    // const A = +new Date();
    if (typeof this.progress === "undefined") {
        this.progress = Progress(x.r, x.w);
    }
    // const B = +new Date();
    const { i, c } = this.progress();
    // const C = +new Date();
    const out = new Array(globals.leds);
    // const D = +new Date();
    const left = x.x;
    const right = x.y;
    // const E = +new Date();
    for (let j = 0; j < globals.leds; j++)
        out[j] = take(c ^ +(j % x.w > i) ? left : right, j);
    // const F = +new Date();
    // console.log(`A: ${B - A} B: ${C - B} C: ${D - C} D: ${E - D} E: ${F - E}`);
    return out;
}

*/



function simple_timer(period = PERIOD, range = COUNT) {
    const start_time = +new Date;

    return () => {
        const now = +new Date;
        const elapsed_time = now - start_time
        const fraction_of_period_elapsed = (elapsed_time % period) / period
        return Math.floor(fraction_of_period_elapsed * range)
    }
}

function index_based_timer(period = PERIOD, range = COUNT) {
    const index_timer = simple_timer(period, range)

    return () => {
        const out = new Array(range).fill(0)
        out[index_timer()] = 1
        return out
    }
}

function factory(x: { (): { (): any } }): React.FC {
    return () => {
        const [state, set_state] = useState<any>()
        useEffect(() => {
            let canceled = false;
            const timer = x();
            const run = async () => {
                const delay = new Promise((resolve) => { setTimeout(resolve, 50) })
                const value = timer()
                if (!equal(value, state))
                    set_state(value)
                await delay
                if (canceled) { return }
                run()

            }
            run()

            return () => { canceled = true }
        }, [])
        return (<Output><pre><code>{JSON.stringify(state)}</code></pre></Output>)
    }
}

export const special_components: { [id: string]: React.FC } = {
    simple_timer: factory(simple_timer),
    index_based_timer: factory(index_based_timer),
    zig_zag: factory(zig_zag),
    complex_timer: factory(complex_timer)
}
