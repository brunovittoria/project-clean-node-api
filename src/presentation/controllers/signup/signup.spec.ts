import { SignupController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel
} from '../signup/signup-protocols'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    /// stub é uma classe que implementa a interface e retorna um valor fixo/mockado facilitando o teste
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }

      return new Promise((resolve) => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  // factory ele serve para criar uma instância do sut (System Under Test) e reutilizar em todos os testes
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignupController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignupController', () => {
  test('Should return 400 if no name is provided', async () => {
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
    const httpResponse = await await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation is provided', async () => {
    // Arrange (Preparação)
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Should return 400 if password confirmation fails', async () => {
    // Arrange (Preparação)
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    // Act (Ação)
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should call emailvalidator with correct email', async () => {
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
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  // Se o email validator retornar uma excecao devemos retornar 500
  test('Should return 500 if email validator throws', async () => {
    // Arrange (Preparação)
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error() //Esta e uma forma de simular um erro sem precisar criar uma factory nova
    })

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if addAccount throws', async () => {
    // Arrange (Preparação)
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    // Arrange (Preparação)
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    // Act (Ação)
    await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 200 if an valid data is provided', async () => {
    // Arrange (Preparação)
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid name',
        email: 'valid_email@mail.com',
        password: 'valid_any_password',
        passwordConfirmation: 'valid_any_password'
      }
    }
    // Act (Ação)
    const httpResponse = await sut.handle(httpRequest)

    // Assert (Verificação)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
  })
})
