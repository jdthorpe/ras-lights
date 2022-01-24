import { register as _register } from "shared/src/registry";
export const register = _register;
export const typeof_register = typeof _register;
export const hello = "world";

// export const register: typeof _register = (...args) => _register(...args);
export const bye = () => console.log("bye");
