"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const lib_1 = require("./src/lib");
const parser = new argparse_1.ArgumentParser({
    description: "demo parser",
});
const commands = parser.add_subparsers({ dest: "command" });
/* LIBRARY COMMAND PARSER */
const library_parser = commands.add_parser("library");
const library_verbs = library_parser.add_subparsers({ dest: "verb" });
/* library list */
library_verbs.add_parser("list");
/* library delete */
const verb_delete_library = library_verbs.add_parser("delete");
verb_delete_library.add_argument("-n", "--name", {
    type: "str",
    required: true,
});
/* library create */
const verb_create_library = library_verbs.add_parser("create");
verb_create_library.add_argument("-n", "--name", {
    type: "str",
    required: true,
});
verb_create_library.add_argument("-p", "--path", {
    type: "str",
    required: true,
});
process_args();
async function process_args() {
    const args = parser.parse_args();
    console.log(args);
    switch (args.command) {
        case "library":
            switch (args.verb) {
                case "list":
                    const libs = await (0, lib_1.list_library)();
                    libs.forEach((lib) => console.log(JSON.stringify(lib)));
                    console.log("ok");
                    break;
                case "delete":
                    await (0, lib_1.remove_library)(args.name);
                    console.log("ok");
                    break;
                case "create":
                    await (0, lib_1.upsert_library)({ name: args.name, path: args.path });
                    console.log("ok");
                    break;
                default:
                    console.log(`Unknown command ${args.command} ${args.verb}`);
            }
            break;
        default:
            console.log(`Unknown command ${args.command}`);
    }
}
// parser.add_argument('-v', '--version', { action: 'version', version });
// parser.add_argument('-f', '--foo', { help: 'foo bar' });
// parser.add_argument('-b', '--bar', { help: 'bar foo' });
// parser.add_argument('--baz', { help: 'baz bar' });
// console.dir(parser.parse_args());
