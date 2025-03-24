import { AccountModel } from '../models/account'

//Criamos a interface AddAccount aqui pois somente esse useCase ira usar ela, ja o AccountModel é o modelos da conta que esta no DB e pode ser usado em outros lugares
export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add (account: AddAccountModel): Promise<AccountModel>
}

//Criamos essas interfaces aqui dentro e nao dentro de protocols pois no TDD as interfaces dos useCases sao criadas dentro do useCase e nao dentro de protocols