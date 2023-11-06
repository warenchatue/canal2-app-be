import { sendError } from 'src/common/helpers';

export class BaseController {
  protected async run<A>(func: () => any): Promise<A> {
    try {
      return await func();
    } catch (error) {
      sendError(error);
    }
  }
}
