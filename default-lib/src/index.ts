interface def {
    name: string;
    func: func;
    input: any[]; // input[],
    output: string; // value // | values
}
interface register {
    (x: def): void;
}

const defs: def[] = [];

export function register(x: def) {
    defs.push(x);
}

export function load(cb: register): void {
    for (let d of defs) cb(d);
}

// damn those circular imports
import "./rgb";
import "./rgbw";
import "./w";
