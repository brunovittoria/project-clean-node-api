import { SignupController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignupController', () => {
  test('Should return 400 if no name is provided', () => {
    // Arrange (Preparação)
    const sut = new SignupController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    // Arrange (Preparação)
    const sut = new SignupController()
    const httpRequest = {
      body: {
        name: 'any name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    // Arrange (Preparação)
    const sut = new SignupController()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', () => {
    // Arrange (Preparação)
    const sut = new SignupController()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
      }
    }
    // Act (Ação)
    const httpResponse = sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password confirmation'))
  })

})

//sut: System Under Test