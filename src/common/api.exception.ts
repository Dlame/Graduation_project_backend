import { HttpException, HttpStatus } from "@nestjs/common";

export class ApiException extends HttpException {

  constructor(
    private errorMessage: string,
    statusCode: HttpStatus) {
    super(errorMessage, statusCode)
  }

  getErrorMessage(): string {
    return this.errorMessage
  }

}