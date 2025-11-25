import { Injectable } from '@angular/core';

export interface StorageObject<T> {
  key: string;
  value: T;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  save<T>(id: string, data: StorageObject<T>): void {
    sessionStorage.setItem(id, JSON.stringify(data.value));
  }

  get<T>(id: string): StorageObject<T> | null {
    const value = sessionStorage.getItem(id);
    return value != null ? JSON.parse(value) : null;
  }

  getAll<T>(): T[] {
    return Object.values(sessionStorage).map((value) => {
      return JSON.parse(value);
    });
  }

  getLastItem<T>(): StorageObject<T> | null {
    const lastKey = sessionStorage.key(sessionStorage.length - 1);
    if (lastKey) {
      const lastValue = sessionStorage.getItem(lastKey);
      if (lastValue) {
        return {
          key: lastKey,
          value: JSON.parse(lastValue),
        };
      }
    }

    return null;
  }

  remove(id: string): void {
    sessionStorage.removeItem(id);
  }
}
