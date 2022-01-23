import chokidar from "chokidar";
import { user_library } from "../../shared/types/admin";
import { setActiveLibrary } from "shared/src/registry";
import { bundle } from "./bundle";
import path from "path";
import debounce from "lodash.debounce";

const watchers: { [key: string]: ReturnType<typeof chokidar.watch> } = {};

export async function unwatch(lib: user_library) {
    if (lib.path in watchers) {
        const watcher = watchers[lib.path];
        await watcher.close();
        delete watchers[lib.path];
    }
}

export function watch(lib: user_library) {
    if (lib.path in watchers) return;

    const watch = chokidar
        .watch(path.normalize(lib.path + "/") + "**/*.js", {
            ignored: /node_modules/,
        })
        .on("change", () => _reimport(lib));

    watchers[lib.path] = watch;
}

const _reimport = debounce(reimport, 250);

export async function reimport(lib: user_library) {
    try {
        // try bundling the library (error out if failed)
        await bundle(lib);
    } catch (err) {
        // TODO: document this
        throw "Failed while trying to bundle the library";
    }

    try {
        setActiveLibrary(lib.name);
        console.log(`>>> About to require lib.path: ${lib.path}`);
        require(lib.path);
        console.log(`>>> Successfully required lib.path: ${lib.path}`);
        setActiveLibrary();
    } catch (err) {
        // TODO: document this
        throw "Failed while trying to bundle import library";
    }
}
