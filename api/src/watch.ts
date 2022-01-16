import chokidar from "chokidar";
import requireDirectory from "require-directory";
import { user_library } from "../../shared/types/admin";
import { setActiveLibrary } from "@ras-lights/shared/src/registry";

export function watch(lib: user_library) {
    chokidar.watch(lib.path).on("change", () => reimport(lib));
}

function reimport(lib: user_library) {
    setActiveLibrary(lib.name);
    requireDirectory(module, lib.path);
    setActiveLibrary();
}
