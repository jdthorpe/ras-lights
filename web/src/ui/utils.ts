import { createContext, FC } from "react";

export async function set_update(key: string, value: any) {
    try {
        const obj = Object.fromEntries([[key, value]]);
        await fetch("/api/ctl/", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });
    } catch (err) {
        console.log("/api/ctl/ failed with error", err);
    }
}

interface ItoolContextProps {
    // get: () => FC;
    setPreview: (x: FC) => void;
    clear: () => void;
}

// let Tool: FC = () => null;

export const ToolContext = createContext<ItoolContextProps>({
    // get: () => Tool,
    setPreview: (x: FC) => {
        /* pass */
    }, // (Tool = x),
    clear: () => () => null,
});
