import "./rgb";
import "./w";

const registerPromise = import("host/register");

export async function register(
    name: string,
    func: func,
    input: any[], // input[],
    output: string // value // | values
) {
    const register = await registerPromise;
    register.register(name, func, input, output);
}
