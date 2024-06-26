import { WsException } from '@nestjs/websockets';
import { SocketExceptions } from '@smart/shared/server/SocketExceptions';
import { ServerExceptionResponse } from '@smart/shared/server/types';

export class ServerException extends WsException
{
  constructor(type: SocketExceptions, message?: string | object)
  {
    const serverExceptionResponse: ServerExceptionResponse = {
      exception: type,
      message: message,
    };

    super(serverExceptionResponse);
  }
}
