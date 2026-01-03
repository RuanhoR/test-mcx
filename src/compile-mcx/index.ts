import Compiler from "./compile-js.ts";
import type { McxOpt } from "../types.ts";
export default function CompileMcxDir(BuildOpt: McxOpt): void {
  const compiler = new Compiler(BuildOpt);

}