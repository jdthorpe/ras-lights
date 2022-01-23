"use strict";
// <reference path="typings/node/node.d.ts" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const typescript_1 = __importDefault(require("typescript"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function reportDiagnostics(diagnostics) {
    diagnostics.forEach((diagnostic) => {
        let message = "Error";
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            message += ` ${diagnostic.file.fileName} (${line + 1},${character + 1})`;
        }
        message +=
            ": " +
                typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        console.log(message);
    });
}
function readConfigFile(configFileName) {
    // Read config file
    const configFileText = fs_1.default.readFileSync(configFileName).toString();
    // Parse JSON, after removing comments. Just fancier JSON.parse
    const result = typescript_1.default.parseConfigFileTextToJson(configFileName, configFileText);
    const configObject = result.config;
    if (!configObject) {
        reportDiagnostics([result.error]);
        process.exit(1);
    }
    // Extract config infromation
    const configParseResult = typescript_1.default.parseJsonConfigFileContent(configObject, typescript_1.default.sys, path_1.default.dirname(configFileName));
    if (configParseResult.errors.length > 0) {
        reportDiagnostics(configParseResult.errors);
        process.exit(1);
    }
    return configParseResult;
}
function compile(configFileName) {
    // Extract configuration from config file
    let config = readConfigFile(configFileName);
    // Compile
    let program = typescript_1.default.createProgram(config.fileNames, config.options);
    let emitResult = program.emit();
    // Report errors
    reportDiagnostics(typescript_1.default.getPreEmitDiagnostics(program).concat(emitResult.diagnostics));
    // Return code
    let exitCode = emitResult.emitSkipped ? 1 : 0;
    process.exit(exitCode);
}
exports.compile = compile;
/*
// original usage

$ tsc compile.ts --m commonjs
$ node compile.js c:\test\tsconfig.json

compile(process.argv[2]);

*/
