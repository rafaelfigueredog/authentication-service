import { HashServiceInterface } from './hash.interface';
import { ArgonService } from './argon.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService implements HashServiceInterface {
  constructor(private readonly argonService: ArgonService) {}

  create(password: string): Promise<string> {
    return this.argonService.create(password);
  }

  verify(hash: string, password: string): Promise<boolean> {
    return this.argonService.verify(hash, password);
  }
}
