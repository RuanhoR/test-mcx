import Context from "./context.js"
import traverse from "@babel/traverse"
import type {
  NodePath
} from "@babel/traverse"
import {
  type Node,
  type ImportDeclaration,
  type ImportSpecifier,
  type ImportDefaultSpecifier,
  type ImportNamespaceSpecifier,
  type ExportSpecifier,
  type ExportNamedDeclaration
  type StringLiteral,
  type Identifier,
  assertImportNamespaceSpecifier,
  assertImportDefaultSpecifier
} from "@babel/types"
import {
  type ImportList,
  type ImportListImport,
} from "./types.js"
import type {
  McxOpt,
} from "../types.js"
import path from "node:path"

import * as t from '@babel/types';

class Compile {
  context = new Context();
  constructor(public ast: Node) {
    traverse.default(ast, this.traverser)
  }
  GetNodeId(node: Node): string[][] {
    switch (node.type) {
      case "VariableDeclaration":
        return node.declaration.map(item => {
          return [item.id.name, item.init]
        });
      case "ClassDeclaration":
        return [node.id.name, node]
      case "FunctionDeclaration":
        return [node.id.name, node]
      case ""
    }
    GetValue(node: StringLiteral | Identifier): string {
      if (node.type === "Identifier") return node.name
      return node.value;
    }
    traverser = {
      ImportDeclaration: (path: NodePath < ImportDeclaration > ): void => {
        if (!this.context.BuildCache?.import) {
          this.context.BuildCache.import = [];
        }
        const node: ImportDeclaration = path.node;
        let imp: ImportListImport[] = node
          .specifiers
          .map((item: ImportNamespaceSpecifier | ImportSpecifier | ImportDefaultSpecifier): ImportListImport => {
            const to: string = item.local?.name || "";
            if (item.type === "ImportDefaultSpecifier") return {
              isAll: false,
              import: "default",
              as: to
            };
            if (item.type === "ImportNamespaceSpecifier") return {
              isAll: true,
              as: to
            }
            const lit = item.imported;
            let imp: string = "default";
            if (lit.type === "StringLiteral") {
              imp = lit.value
            } else if (lit.type === "Identifier") {
              imp = lit.name;
            }
            return {
              isAll: false,
              import: imp,
              as: to
            }
          });
        const source = node.source.value;
        const addV: ImportList = {
          imported: imp,
          source,
          raw: node
        };
        path.remove();
        this.context.BuildCache.import.push(addV);
      }
      ExportNamedDeclaration: (path: NodePath < E xportNamedDeclaration > ): void => {
        const node = path.node;
        const exp = node.declaration;
        // Example Node - export function xxx(){}
        if (exp !== null && !node.source) {
          this.GetNodeId(exp).forEach(item => {
            if (this.context.export[item[0]])
              throw new Error("[compile error]: export declaration Repeat");
            this.context.export[item[0]] = item[1];
          });
        };
        // if declaration is null
        const Specifier = node.specifiers;
        if (Specifier) {
          // Example Node - export {test}
          if (!node.source) {
            Specifier.forEach(
              (item: ExportSpecifier) => {
                if (this.context.export[item.exported.name])
                  throw new Error("[compile error]: export declaration Repeat");
                // in next, Generate code time, can splice node, this node is global , so direct write node
                this.context.export[item.exported.name] = item.local;
              });
          } else {
            // have source
            // Example - export {xxx} from "./module"
            // because this format is special, so use tag not use node
            const ImportItem: ImportListImport[] = Specifier.map(
              (item: ExportSpecifier): ImportListImport => {
                return {
                  as: this.GetValue(item.exported),
                  import: this.GetValue(item.local),
                  isAll: false
                }
              })
            const ImportTag: ImportList = {
              source: this.GetValue(node.source),
              imported:
            }
            this.context.export[]
          }
        };
      }
    }
  }
  export default async function _compile(ast: Node) {
    return new Compile(ast)
  }