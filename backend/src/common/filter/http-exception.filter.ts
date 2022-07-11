import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

//다중상속은 기본적으로 지원하지 않는다.
//구현은 다중 구현 가능.
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('=================');
    console.log('에러가 발생했어요');
    console.log('에러내용:', message);
    console.log('에러 코드:', status);
    console.log('=================');
  }
}
