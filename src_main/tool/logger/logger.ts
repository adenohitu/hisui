const colors = {
  black: "\u001b[30m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
  cyan: "\u001b[36m",
  white: "\u001b[37m",
  reset: "\u001b[0m",
};
export class logger {
  static info(messages: string, resource?: string) {
    console.log(
      `[${new Date().toISOString()}] ${colors.cyan}info:${colors.reset} ${
        (resource !== undefined && `[${resource}] `) || ""
      }${messages}`
    );
  }
  static error(messages: string, resource?: string) {
    console.log(
      `[${new Date().toISOString()}] ${colors.red}error:${colors.reset} ${
        (resource !== undefined && `[${resource}] `) || ""
      }${messages}`
    );
  }
  static colors = colors;
}
