import AST from "./ast/index.ts";
import compiler from "./compile-mcx/index.ts";
import utils from "./utils.ts";
import errors from "./errors.ts"
export default {
  load: compiler,
  AST: AST,
  utils: utils,
  errorList: errors
}
Object.setPrototypeOf(module.exports, null);