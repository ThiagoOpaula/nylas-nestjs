import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { NylasController } from './nylas/nylas.controller';
import { NylasService } from './nylas/nylas.service';
import { ConfigModule } from '@nestjs/config';
import { AuthNylasMiddleware } from './nylas/authNylas.middleware';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NylasController],
  providers: [NylasService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthNylasMiddleware).forRoutes('nylas');
  }
}
