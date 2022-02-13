import { fetch_libraries } from "./admin/lib-api";
import { register } from "shared/src/registry";

declare var __webpack_init_sharing__: { (x: string): Promise<void> };
declare var __webpack_share_scopes__: any;

async function loadComponent(scope: string, module: string): Promise<library> {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    console.log(`[Module loader] Webpack Init: ${scope}`);
    await __webpack_init_sharing__("default");

    // @ts-ignore
    const container: any = window[scope] as any; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    console.log(`[Module loader] Container Init: ${scope}`);
    await container.init(__webpack_share_scopes__.default);
    console.log(`[Module loader] module.get(): ${scope}`);
    // @ts-ignore
    const factory = await window[scope].get(module);
    console.log(`[Module loader] factory(): ${scope}`);
    const Module = factory();
    console.log(`[Module loader] "${scope}" DONE!!: ${scope}`);
    console.log(`[Module loader] "${scope}" module type ${typeof Module}`);
    console.log(
        `[Module loader] "${scope}" module keys  ${Object.keys(Module)}`
    );
    return Module as library;
}

const loadScript = (url: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const element = document.createElement("script");
        element.src = url;
        element.type = "text/javascript";
        element.async = true;
        document.head.appendChild(element);
        element.onload = () => {
            // document.head.removeChild(element);
            console.log(`[Script loader] Success: ${url}`);
            resolve();
        };
        element.onerror = () => {
            console.log(`[Script loader] Failed: ${url}`);
            document.head.removeChild(element);
            reject();
        };
    });
};

async function load_library(name: string) {
    await loadScript(`/lib/${name}/remoteEntry.js`);
    return await loadComponent(name, "./lib");
}

interface library {
    load: { (x: typeof register): void };
}

export async function load_remotes() {
    const libs = await fetch_libraries();
    for (let lib of libs) {
        console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-");
        console.log(`about to load library ${lib.name}`);
        let mod: library = await load_library(lib.name);
        console.log(`loaded library ${lib.name}`);
        console.log(`library ${lib.name} is of type ${typeof mod}`);
        console.log(`library ${lib.name} has keys ${Object.keys(mod)}`);
        mod.load(register);
        console.log(`REGISTERED LIBRARY ${lib.name}`);
    }

    // await Promise.all(
    //     libs.map(async (lib) => {
    //         console.log(`about to load library ${lib.name}`);
    //         const mod: library = await load_library(lib.name);
    //         console.log(`loaded library ${lib.name}`);
    //         console.log(`library ${lib.name} is of type ${typeof mod}`);
    //         console.log(`library ${lib.name} has keys ${Object.keys(mod)}`);
    //         mod.load(register);
    //         console.log(`REGISTERED LIBRARY ${lib.name}`);
    //     })
    // );
}
