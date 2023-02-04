import {isDevMode} from "@angular/core";

class Logger {

  error(prefix: string, msg: any) {
    console.error(this.getMessage('error', prefix), msg);
  }

  warn(prefix: string, msg: any) {
    console.warn(this.getMessage('warn', prefix), msg);
  }

  log(prefix: string, msg: any) {
    console.log(this.getMessage('log', prefix), msg);
  }

  info(prefix: string, msg: any) {
    console.info(this.getMessage('info', prefix), msg);
  }

  debug(prefix: string, msg: any) {
    if (isDevMode()) {
      console.debug(this.getMessage('debug', prefix), msg);
    }
  }

  private getMessage(level: string, prefix: string): string {
    return `[${prefix}] ${level.toUpperCase()}:`;
  }
}

export default Logger;
