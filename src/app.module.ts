import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    TasksModule,
    AuthModule,
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      url: 'postgres://sonruviinqeddn:61c1eac5372687b950bdc86cd865439d4d8414c4e93471887349c1aff24cfbfd@ec2-35-153-91-18.compute-1.amazonaws.com:5432/d8527alglmip0v',
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
})
export class AppModule {}
