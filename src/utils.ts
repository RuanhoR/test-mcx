import fs from "node:fs/promises"
module.exports = class McxUtlis {
  static async FileExsit(path: string): boolean {
    try {
      await fs.access(path);
      return true
    } catch {
      return false
    }
  }
  static async readFile(filePath: string, opt: object = {}): object || string {
    const opts = {
      maxRetries: 5,
      delay: 200,
      want: 'string',
      ...opt
    }
    let lastError: Error;
    for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
      try {
        let text = await fs.readFile(filePath);
        if (opts.want === 'string') text = text.toString()
        if (opts.want === 'object') {
          try {
            text = JSON.parse(text)
          } catch {
            text = {}
          }
        }
        return text;
      } catch (err) {
        lastError = err;
        if (attempt < opts.maxRetries - 1) {
          await McxUtlis.sleep(opts.delay);
        }
      }
    }
    return {};
  }
  static sleep(time: number): Promise<void> {
    return new Promise((then) => setTimeout(then, time))
  }
}