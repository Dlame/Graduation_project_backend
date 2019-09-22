import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = exception.message;
    var resMessage: string = '';
    if (typeof message == 'object') {
      resMessage = message.error;
    } else if (typeof message == 'string') {
      resMessage = message;
    }

    response.status(status).json({
      statusCode: status,
      message: resMessage,
      date: new Date().toLocaleDateString(),
      path: request.url,
    });
  }
}
