// expose the registry from the shared library...
import { register as _register } from "shared/src/registry";
export const register = _register;
export const typeof_register = typeof _register;
