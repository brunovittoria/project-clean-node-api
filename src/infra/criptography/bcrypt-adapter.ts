import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter';

export class BcryptAdapter implements Encrypter {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}

// Este é um adapter de uma biblioteca externa (bcrypt) para o padrão de projeto Adapter. Sendo assim este adapter n pode ter coisas especificas da lib "bcrypt" pois a funcao do Adapter é ser multiuso para possiveis outras LIBS.