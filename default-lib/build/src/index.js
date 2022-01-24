"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const registerPromise = Promise.resolve().then(() => __importStar(require("host/register")));
// @ts-ignore
Promise.resolve().then(() => __importStar(require("host/reister"))).then((m) => console.log("host/register loaded !!!!!!!!!!!!!!!!!!!!!!!!!!!", JSON.stringify(m)))
    .catch(() => console.log("host/register failed to load !!!!!!!!!!!!!!!!!!!!"));
console.log("HI FROM THE INTERNAL LIBRARY");
function register(name, func, input, // input[],
output // value // | values
) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("[internal register] waiting for the host/register");
            console.log(`[internal register] registerPromise ${registerPromise}`);
            const register = yield Promise.resolve().then(() => __importStar(require("host/register")));
            console.log("typeof host/register.default: ", typeof register.default);
            console.log("keys of host/register: ", JSON.stringify(Object.keys(register.default)));
            // @ts-ignore
            register.default(name, func, input, output);
            console.log("register.register DONE");
        }
        catch (err) {
            console.log(`dang, something went wrong when registering library ${name}`);
            console.log(err.message);
            console.log(err);
        }
    });
}
exports.register = register;
// damn those circular imports
require("./rgb");
require("./w");
