import { HashServiceInterface } from './hash.interface';
import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class ArgonService implements HashServiceInterface {
  create(password: string) {
    return argon.hash(password);
  }
  verify(hash: string, password: string) {
    return argon.verify(hash, password);
  }
}
