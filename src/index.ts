import AST from "./ast/index";
import compiler from "./compile-mcx";
import utils from "./utils";
import errors from "./errors"
export default {
  load: compiler,
  AST: AST,
  utils: utils,
  errorList: errors
}
Object.setPrototypeOf(module.exports, null);