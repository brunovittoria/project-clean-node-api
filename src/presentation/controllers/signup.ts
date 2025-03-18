import { MissingParamError } from '../errors/missing-param-error'

export class  SignupController {
  handle (httpRequest: any): any {
      if(!httpRequest.name) {
        return {
          statusCode: 400,
          body: new MissingParamError('name')
        } 
      }

    if(!httpRequest.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    } 
  }
}