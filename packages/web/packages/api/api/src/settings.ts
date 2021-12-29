import { readFileSync } from "fs";
import { join } from "path";
import ini from "ini";

interface Isettings {
    LEDS: number;
    controller: {
        port: number;
    };
    show: {
        controller_host: string;
        port: number;
    };
    ws281x: any;
}

const settings: Isettings = ini.parse(
    readFileSync(join(__dirname, "..", "..", "..", "config.ini"), "utf-8")
) as Isettings;

export default settings;
