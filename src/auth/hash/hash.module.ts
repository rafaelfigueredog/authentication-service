import { Module } from '@nestjs/common';
import { ArgonService } from './argon.service';
import { HashService } from './hash.service';

@Module({
  providers: [HashService, ArgonService],
  exports: [HashService],
})
export class HashModule {}
