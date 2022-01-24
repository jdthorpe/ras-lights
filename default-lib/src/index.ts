const registerPromise = import("host/register");
console.log("HI FROM THE INTERNAL LIBRARY");

export async function register(
    name: string,
    func: func,
    input: any[], // input[],
    output: string // value // | values
) {
    try {
        console.log("[internal register] waiting for the host/register");
        const register = await registerPromise;
        console.log(" host/register module: ", JSON.stringify(register));
        console.log("keys of host/register: ", Object.keys(register));

        // @ts-ignore
        register.register(name, func, input, output);
        console.log("register.register DONE");
    } catch (err) {
        console.log(
            `dang, something went wrong when registering library ${name}`
        );
        console.log((err as any).message);
        console.log(err as any);
    }
}

import { domainToASCII } from "url";
// damn those circular imports
import "./rgb";
import "./w";
