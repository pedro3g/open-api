/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import '@nestjs/common';

declare module '@nestjs/common' {
  export class BadRequestException {
    constructor(data: {
      status: 'error.userAlreadyExists' | 'error.invalidField';
      [key?: string]: any;
    }) {}

    getResponse(): object;
  }
}
