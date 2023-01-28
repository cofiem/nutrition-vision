import {isDevMode} from "@angular/core";

class Logger {

  error(prefix: string, msg: any) {
    console.error(this.GetMessage('error', prefix), msg);
  }

  warn(prefix: string, msg: any) {
    console.warn(this.GetMessage('warn', prefix), msg);
  }

  log(prefix: string, msg: any) {
    console.log(this.GetMessage('log', prefix), msg);
  }

  info(prefix: string, msg: any) {
    console.info(this.GetMessage('info', prefix), msg);
  }

  debug(prefix: string, msg: any) {
    if (isDevMode()) {
      console.debug(this.GetMessage('debug', prefix), msg);
    }
  }

  private GetMessage(level: string, prefix: string): string {
    return `[${prefix}] ${level.toUpperCase()}:`;
  }
}

export default Logger;
