import { MongoHelper } from './../helpers/mongo-helper';
import { AccountMongoRepo } from './account';

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL
    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is required')
    }
    await MongoHelper.connect(mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    const sut = new AccountMongoRepo()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email')
  })
});