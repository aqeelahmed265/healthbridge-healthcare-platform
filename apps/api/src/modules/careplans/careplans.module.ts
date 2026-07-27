import { Module } from '@nestjs/common';
import { CarePlansService } from './careplans.service';
import { CarePlansController } from './careplans.controller';

@Module({
  controllers: [CarePlansController],
  providers: [CarePlansService],
  exports: [CarePlansService],
})
export class CarePlansModule {}
