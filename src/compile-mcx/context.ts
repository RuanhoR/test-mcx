import os from "node:os"
import type {
  MCX_INFO,
  BuildCache
} from "./types.js"
import type {
  McxOpt,
} from "../types.js"
const versions = os.userInfo();
const buildSystem: string = os.type();
const buildSystemVersion: string = os.version();
export default class Context {
  BuildCache: BuildCache = {}
  __MCX__: MCX_INFO = {
    author: "github@RuanhoR",
    buildSystem,
    buildSystemVersion,
    buildTime: Date.now()
  }
}