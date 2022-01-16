import { value, input } from "@ras-lights/shared/types/parameters";

type _builder = (args: templateParams) => string;

function templateBuilder(args: templateParams): string {
    const builder = (strings: TemplateStringsArray, ...values: _builder[]) => {
        let str = "";
        strings.forEach((string, i) => {
            let bldr = values[i];
            str += string + (typeof bldr === "undefined" ? "" : bldr(args));
        });
        return str;
    };

    return builder`import { register, globals } from "../index";
${usedValueTypes}
interface input {
${interfaces}}

function effect(this: any, x: input, globals: globals): ${output_type} {
    // Your code goes here...
}

register(
    "${(args: templateParams) => args.effectName}",
    effect,
    ${inputs},
    "${output_type}"
);
`;
}

interface templateParams {
    effectName: string;
    inputs: input[];
    output_type: value;
}

function output_type(args: templateParams): string {
    return args.output_type;
}

function interfaces(args: templateParams): string {
    return args.inputs
        .map((i) => `    ${i.key}: ${i.type};\n`)
        .reduce((a, b) => `${a}${b}`, "");
}

function _input(i: input): string {
    let out: string = `            key: "${i.key}",
            type: "${i.type}",
            label: "${i.label}",
            default: ${JSON.stringify(i.default)},`;
    if (i.type === "number" || i.type === "integer")
        out += `
            min: "${i.min}",
            max: ${JSON.stringify(i.min)},`;

    return `        {
${out}
        },`;
}

function inputs(args: templateParams): string {
    if (!args.inputs.length) return "[]";
    const out = args.inputs.map(_input).reduce((a, b) => `${a}\n${b}`, "");
    return `[${out}
    ]`;
}

function usedValueTypes(args: templateParams): string {
    const types = new Set<string>();
    switch (args.output_type) {
        case "rgb":
        case "rgb[]":
            types.add("rgb");
            break;
    }
    for (let i of args.inputs) {
        switch (i.type) {
            case "rgb":
            case "rgb[]":
                types.add("rgb");
                break;
        }
    }
    if (!types.size) return "";
    const type_imports = Array.from(types.values()).reduce(
        (a, b) => `${a}, ${b}`
    );
    return `import { ${type_imports} } from "@ras-lights/shared/types/mode";\n`;
}

export default templateBuilder;
