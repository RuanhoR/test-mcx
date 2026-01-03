// McxAst.ts

export default class McxAst {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  get data(): IterableIterator < any > {
    return this.generateAst();
  }

  private generateAst(): IterableIterator < any > {
    const lexer = new Lexer(this.text);
    return lexer.tokensSymbol.iterator;
  }
}

class Lexer {
  private text: string;
  private booleanProxyCache: WeakMap < object, any > ;

  public constructor(text: string) {
    this.text = text;
    this.booleanProxyCache = new WeakMap();
  }

  get tokens(): {
    Symbol.iterator: IterableIterator < any >
  } {
    return {
      [Symbol.iterator]: this.tokenIterator.bind(this),
    };
  }

  /**
   * 解析标签内的属性，例如 <div id="app" disabled />
   */
  public parseAttributes(tagContent: string): {
    name: string;arr: Record < string,
    string | boolean >
  } {
    const attributes: Record < string, string > = {};
    let currentKey = '';
    let currentValue = '';
    let inKey = true;
    let name = '';
    let inValue = false;
    let quoteChar: string | null = null;
    let isTagName = true; // 是否在解析标签名阶段

    for (let i = 0; i < tagContent.length; i++) {
      const char = tagContent[i];

      if (isTagName) {
        if (char === ' ' || char === '>') {
          name = currentKey.trim();
          currentKey = '';
          isTagName = false;
          if (char === '>') break; // 标签结束
        } else {
          currentKey += char;
        }
        continue;
      }

      if (inValue) {
        if (char === quoteChar && (currentValue.length === 0 || currentValue[currentValue.length - 1] !== '\\')) {
          attributes[currentKey.trim()] = currentValue;
          currentKey = '';
          currentValue = '';
          inKey = true;
          inValue = false;
          quoteChar = null;
        } else {
          currentValue += char;
        }
      } else if (char === '=' && inKey) {
        inKey = false;
        inValue = true;
        const nextIndex = i + 1;
        const nextChar = nextIndex < tagContent.length ? tagContent[nextIndex] : ' ';
        quoteChar = (nextChar === '"' || nextChar === "'") ? nextChar : null;
      } else if (char === ' ' && inKey && currentKey) {
        attributes[currentKey.trim()] = 'true';
        currentKey = '';
      } else if (inKey) {
        currentKey += char;
      }
    }

    if (isTagName) {
      name = currentKey.trim();
    } else if (currentKey) {
      attributes[currentKey.trim()] = inValue ?
        currentValue.replace(/^["']/, '').replace(/["']$/, '') :
        'true';
    }

    return {
      name,
      arr: attributes as Record < string,
      string | boolean > , // 可能需要进一步转换 boolean
    };
  }

  /**
   * 返回一个 Token 迭代器
   */
  * tokenIterator(): IterableIterator < any > {
    const tagTokens = Array.from(this.tagSplitIterator());
    let currentTag: any = {};
    let contentStartIndex = 0;

    for (let i = 0; i < tagTokens.length; i++) {
      const token = tagTokens[i];

      if (token.type === 'Tag') {
        const arr = this.parseAttributes(token.data.slice(1, -1));
        currentTag = {
          start: token,
          name: arr.name,
          arr: arr.arr, // 属性键值对
          content: null,
          end: null,
        };
        contentStartIndex = i + 1;
      } else if (token.type === 'TagEnd' && currentTag) {
        currentTag.end = token;

        let contentData = '';
        for (let j = contentStartIndex; j < i; j++) {
          contentData += tagTokens[j].data;
        }

        currentTag.content = {
          data: contentData,
          type: 'TagContent',
        };

        // 冻结部分对象，防止修改
        Object.freeze(currentTag.start);
        Object.freeze(currentTag.end);
        Object.freeze(currentTag.content);
        Object.seal(currentTag);

        yield currentTag;
        currentTag = null;
      }
    }
  }

  /**
   * 将输入文本拆分为标签和内容块
   */
  * tagSplitIterator(): IterableIterator < {
    data: string;type: 'Tag' | 'TagEnd' | 'Content'
  } > {
    let inTag = false;
    let buffer = '';
    let inContent = false;
    let contentBuffer = '';

    for (const char of this.text) {
      if (char === '<') {
        if (contentBuffer) {
          yield {
            data: contentBuffer,
            type: 'Content',
          };
          contentBuffer = '';
        }

        inTag = true;
        buffer = '<';
      } else if (char === '>') {
        if (!inTag) {
          throw new Error("未匹配的 '>'");
        }

        buffer += '>';
        inTag = false;

        const type = buffer.startsWith('</') ? 'TagEnd' : 'Tag';
        yield {
          data: buffer,
          type,
        };

        buffer = '';
      } else if (inTag) {
        buffer += char;
      } else {
        contentBuffer += char;
      }
    }

    if (contentBuffer) {
      yield {
        data: contentBuffer,
        type: 'Content',
      };
    }
  }

  /**
   * 创建一个用于动态布尔属性访问的 Proxy
   */
  getBooleanCheckProxy(): {
    [key: string]: boolean
  } {
    if (!this.booleanProxyCache.has(this)) {
      const charMap = new Map < string,
        boolean > ();
      const proxy = new Proxy({}, {
        get(_: any, prop: string | symbol): boolean {
          if (typeof prop !== 'string') return false;
          return charMap.get(prop) || false;
        },
        set(_: any, prop: string | symbol, value: any): boolean {
          if (typeof prop !== 'string') return false;
          charMap.set(prop, Boolean(value));
          return true;
        },
      });
      this.booleanProxyCache.set(this, proxy);
    }
    return this.booleanProxyCache.get(this) as {
      [key: string]: boolean
    };
  }
}