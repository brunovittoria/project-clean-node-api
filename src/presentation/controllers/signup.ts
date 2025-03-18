import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class  SignupController {
  handle (httpRequest: any): any {
      if(!httpRequest.name) {
        return badRequest(new MissingParamError('name'))
      }

    if(!httpRequest.email) {
      return badRequest(new MissingParamError('email'))
    } 
  }
}