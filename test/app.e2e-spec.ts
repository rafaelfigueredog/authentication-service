import { CreateUser } from './../src/users/interfaces/create-user';
import { SigninAuthDto } from './../src/auth/dto/signin-auth.dto';
import { SignupAuthDto } from './../src/auth/dto/signup-auth.dto';
import { PrismaService } from './../src/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

import * as api from 'pactum';
import { UpdateUser } from 'src/users/interfaces';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();
    api.request.setBaseUrl(process.env.API_BASE_URL);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('SignUp', () => {
      it('Should throw error if email is empty', () => {
        const dto: SignupAuthDto = {
          fullName: 'John Doe',
          email: '',
          password: '123456',
        };

        return api.spec().post('/auth/signup').withBody(dto).expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        const dto: SignupAuthDto = {
          fullName: 'John Doe',
          email: 'john@gmail.com',
          password: '',
        };

        return api.spec().post('/auth/signup').withBody(dto).expectStatus(400);
      });

      it('Should throw error if no body is provided', () => {
        return api.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should throw error if password length less than 6', () => {
        const dto: SignupAuthDto = {
          fullName: 'John Doe',
          email: 'john@gmail.com',
          password: '12345',
        };

        return api.spec().post('/auth/signup').withBody(dto).expectStatus(400);
      });

      it('Should throw error if password length is greater than 12', () => {
        const dto: SignupAuthDto = {
          fullName: 'John Doe',
          email: 'john@gmail.com',
          password: '0123456789012',
        };

        return api.spec().post('/auth/signup').withBody(dto).expectStatus(400);
      });

      it('Should signup', () => {
        const dto: SignupAuthDto = {
          fullName: 'John Doe',
          email: 'john@gmail.com',
          password: '123456',
        };

        return api.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });

      it('should throw error if create user with an email already used', () => {
        const dto: SignupAuthDto = {
          fullName: 'John Doe',
          email: 'john@gmail.com',
          password: '123456',
        };

        return api.spec().post('/auth/signup').withBody(dto).expectStatus(400);
      });
    });

    describe('SignIn', () => {
      it('Should throw error if email is empty', () => {
        const dto: SigninAuthDto = {
          email: '',
          password: '123456',
        };

        return api.spec().post('/auth/signin').withBody(dto).expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        const dto: SigninAuthDto = {
          email: 'john@gmail.com',
          password: '',
        };

        return api.spec().post('/auth/signin').withBody(dto).expectStatus(400);
      });

      it('Should throw error if no body is provided', () => {
        return api.spec().post('/auth/signin').expectStatus(400);
      });

      it('Should throw error if password length less than 6', () => {
        const dto: SigninAuthDto = {
          email: 'john@gmail.com',
          password: '12345',
        };

        return api.spec().post('/auth/signin').withBody(dto).expectStatus(400);
      });

      it('Should throw error if password length is greater than 12', () => {
        const dto: SigninAuthDto = {
          email: 'john@gmail.com',
          password: '0123456789012',
        };

        return api.spec().post('/auth/signin').withBody(dto).expectStatus(400);
      });

      it('Should signin', () => {
        const dto: SigninAuthDto = {
          email: 'john@gmail.com',
          password: '123456',
        };

        return api
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('accessToken', 'accessToken');
      });
    });
  });

  describe('User', () => {
    describe('Get users', () => {
      it('should throw error on get users without authorization', () => {
        return api.spec().get('/users').expectStatus(401);
      });

      it('should get users with authorization', () => {
        return api
          .spec()
          .get('/users')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .expectStatus(200);
      });
    });

    describe('Create User', () => {
      it('should throw error if create user with duplicate email', () => {
        const dto: CreateUser = {
          fullName: 'John Doe',
          email: 'john@gmail.com',
        };

        return api
          .spec()
          .post('/users')
          .withBody(dto)
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .expectStatus(403);
      });

      it('should create new user', () => {
        const dto: CreateUser = {
          fullName: 'Rafael Guimarães',
          email: 'rafaelguimaraes@gmail.com',
        };

        return api
          .spec()
          .post('/users')
          .withBody(dto)
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .expectStatus(201)
          .stores('userUUID', 'uuid');
      });
    });

    describe('Update User', () => {
      it('should throw error if update user without uuid', () => {
        return api.spec().patch('/users').expectStatus(404);
      });

      it('should throw error if try update user with invalid email', () => {
        const dto: UpdateUser = {
          fullName: 'Rafael F. Guimarães',
          email: 'dsa',
        };

        return api
          .spec()
          .patch('/users/$S{userUUID}')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .withBody(dto)
          .expectStatus(400);
      });

      it('should update user', () => {
        const dto: UpdateUser = {
          fullName: 'Rafael F. Guimarães',
        };

        return api
          .spec()
          .patch('/users/$S{userUUID}')
          .withHeaders({ Authorization: 'Bearer $S{accessToken}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.fullName);
      });
    });
  });

  // describe('Facility', () => {});
  // describe('Accommodation', () => {});
  // describe('Reservation', () => {});
});
