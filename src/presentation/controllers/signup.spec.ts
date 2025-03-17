import { SignupController } from './signup'

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
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
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
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })

})

//sut: System Under Test