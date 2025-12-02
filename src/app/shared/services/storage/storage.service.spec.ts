import { TestBed } from '@angular/core/testing';

import { StorageService, StorageObject } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save', () => {
    it('should save data to sessionStorage', () => {
      const data: StorageObject<string> = {
        key: 'testKey',
        value: 'testValue',
      };
      service.save('testId', data);

      expect(sessionStorage.getItem('testId')).toBe(
        JSON.stringify('testValue')
      );
    });

    it('should save object data to sessionStorage', () => {
      const data: StorageObject<{ name: string }> = {
        key: 'testKey',
        value: { name: 'John' },
      };
      service.save('testId', data);

      expect(sessionStorage.getItem('testId')).toBe(
        JSON.stringify({ name: 'John' })
      );
    });
  });

  describe('get', () => {
    it('should return parsed value from sessionStorage', () => {
      sessionStorage.setItem('testId', JSON.stringify({ name: 'John' }));

      const result = service.get<{ name: string }>('testId');

      expect(result).toEqual({ name: 'John' });
    });

    it('should return null when key does not exist', () => {
      const result = service.get('nonExistentKey');

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all values from sessionStorage', () => {
      sessionStorage.setItem('key1', JSON.stringify('value1'));
      sessionStorage.setItem('key2', JSON.stringify('value2'));

      const result = service.getAll<string>();

      expect(result).toContain('value1');
      expect(result).toContain('value2');
      expect(result.length).toBe(2);
    });

    it('should return empty array when sessionStorage is empty', () => {
      const result = service.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('getLastItem', () => {
    it('should return the last item from sessionStorage', () => {
      sessionStorage.setItem('key1', JSON.stringify('value1'));
      sessionStorage.setItem('key2', JSON.stringify('value2'));

      const result = service.getLastItem<string>();

      expect(result).not.toBeNull();
      expect(result?.value).toBeDefined();
    });

    it('should return null when sessionStorage is empty', () => {
      const result = service.getLastItem();

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove item from sessionStorage', () => {
      sessionStorage.setItem('testId', JSON.stringify('testValue'));

      service.remove('testId');

      expect(sessionStorage.getItem('testId')).toBeNull();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => service.remove('nonExistentKey')).not.toThrow();
    });
  });
});
