import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Creat a mock copy of the UsersService
    const users: User[] = [];

    mockUsersService = {
      find: (email: string) => {
        const fileterdUsers = users.filter((user) => user.email === email);
        return Promise.resolve(fileterdUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.sinup('test@test.com', 'test12');

    expect(user.password).not.toEqual('test12');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is aleardy in use', async () => {
    await service.sinup('test@test.com', '1');
    await expect(service.sinup('test@test.com', 'test12')).rejects.toThrow();
  });

  it('throws if signin is called with unused email', async () => {
    await expect(service.signin('test2@test.com', 'test2')).rejects.toThrow();
  });

  it('throws if an invalid passwor is provided', async () => {
    await service.sinup('test2@test.com', 'test10');
    await expect(service.signin('test2@test.com', 'test2')).rejects.toThrow();
  });

  it('returns a user if correct password is provided', async () => {
    await service.sinup('test2@test.com', 'test2');

    const user = await service.signin('test2@test.com', 'test2');
    expect(user).toBeDefined();
  });
});
