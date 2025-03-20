import { SignupController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => { // factory ele serve para criar uma instância do sut (System Under Test) e reutilizar em todos os testes
  class EmailValidatorStub implements EmailValidator { /// stub é uma classe que implementa a interface e retorna um valor fixo/mockado facilitando o teste
    isValid (email: string) : boolean {
      return false
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignupController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignupController', () => {
  test('Should return 400 if no name is provided', () => {
    // Arrange (Preparação)
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', () => {
    // Arrange (Preparação)
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) //Espionando o método isValid e mockando o retorno para false

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call emailvalidator with correct email', () => {
    // Arrange (Preparação)
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = sut.handle(httpRequest)

    // Assert (Verificação)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  // Se o email validator retornar uma excecao devemos retornar 500
  test('Should return 500 if email validator throws', () => {
    // Arrange (Preparação)
    class EmailValidatorStub implements EmailValidator { 
      isValid (email: string) : boolean {
        throw new Error()    
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignupController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

})