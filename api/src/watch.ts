import chokidar from "chokidar";
import fs from "fs";
import { user_library } from "../../shared/types/admin";
import { register, setActiveLibrary } from "shared/src/registry";
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
const LIBRARY_DIR = path.resolve(path.join(__dirname, "../../../lib"));

export async function reimport(lib: user_library) {
    const lib_dist = path.join(LIBRARY_DIR, lib.name);
    const lib_dist_target = path.resolve(path.join(lib.path, "dist"));
    if (!fs.existsSync(lib_dist_target)) {
        console.log(
            `[reimport] Failed to import, no such directory ${lib_dist_target}`
        );
        return;
    }

    if (fs.existsSync(lib_dist)) {
        // the link already exists
        const link = path.resolve(fs.readlinkSync(lib_dist));
        if (link !== lib_dist_target) {
            // but it points to the wrong place
            fs.unlinkSync(lib_dist);
            fs.symlinkSync(lib_dist_target, lib_dist);
        }
    } else {
        fs.symlinkSync(lib_dist_target, lib_dist);
    }

    try {
        //setActiveLibrary(lib.name);
        console.log(`>>> About to require lib.path: ${lib.path}`);
        const library = require(lib.path);
        console.log(`>>> library is type ${typeof library}`);
        console.log(`>>> library has keys ${Object.keys(library)}`);
        library.load(register);
        console.log(`>>> Successfully required lib.path: ${lib.path}`);
        setActiveLibrary();
    } catch (err) {
        // TODO: document this
        throw "Failed while trying to bundle import library";
    }
}
