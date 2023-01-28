import {Injectable} from '@angular/core';
import Logger from "./logger";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  error(prefix: string, msg: any) {
    this.logger.error(prefix, msg);
  }

  warn(prefix: string, msg: any) {
    this.logger.warn(prefix, msg);
  }

  log(prefix: string, msg: any) {
    this.logger.log(prefix, msg);
  }

  info(prefix: string, msg: any) {
    this.logger.info(prefix, msg);
  }

  debug(prefix: string, msg: any) {
    this.logger.debug(prefix, msg);
  }

}
