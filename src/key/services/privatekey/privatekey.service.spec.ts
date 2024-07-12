import { Test, TestingModule } from '@nestjs/testing';
import { PrivatekeyService } from './privatekey.service';
import { Key } from '../../entities/key.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PrivatekeyService', () => {
  let service: PrivatekeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrivatekeyService,
        {
          provide: getRepositoryToken(Key),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<PrivatekeyService>(PrivatekeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be encrypt to expected value', () => {
    const value = 'example';
    const iv = service.hexToBuffer('34c6dc2e17a0f5e20b938c94f67d3087');
    const expectedValue = '34c6dc2e17a0f5e20b938c94f67d3087f8e75f9ab67f8a';
    const encryptedData = service.encryptData(value, iv);
    expect(encryptedData).toEqual(expectedValue);
  });

  it('should be decrypt to expected value', async () => {
    const value = '34c6dc2e17a0f5e20b938c94f67d3087f8e75f9ab67f8a';
    const expectedValue = 'example';
    const decryptedData = await service.reverseKey(value);
    expect(decryptedData).toEqual(expectedValue);
  });
});
