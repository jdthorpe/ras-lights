interface globals {
    leds: number;
}

type func =
    | { (): any }
    | { (inputs: any): any }
    | { (inputs: any, globals: globals): any };
