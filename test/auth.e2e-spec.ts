import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const mockEmail = 'test200@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: mockEmail, password: 'test100' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(mockEmail);
      });
  });

  // it('signup as a new user then get the currently logged user', async () => {
  //   const mockEmail = 'test100@test.com';

  //   const res = await request(app.getHttpServer())
  //     .post('/auth/signup')
  //     .send({ email: mockEmail, password: 'test100' })
  //     .expect(201);

  //   const cookie = res.header['Set-Cookie'];
  //   console.log(cookie);

  //   const { body } = await request(app.getHttpServer())
  //     .get('/auth/whoami')
  //     .set('Cookie', cookie)
  //     .expect(200);

  //   expect(body.email).toEqual(mockEmail);
  // });
});
