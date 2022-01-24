interface globals {
    leds: number;
}

type func =
    | { (): any }
    | { (inputs: any): any }
    | { (inputs: any, globals: globals): any };

// declare module "host/register" {
//     export function register(
//         name: string,
//         func: func,
//         input: any[], // input[],
//         output: string // value // | values
//     ): void;
// }
