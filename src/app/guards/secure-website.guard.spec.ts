import { TestBed } from '@angular/core/testing';

import { SecureWebsiteGuard } from './secure-website.guard';

describe('SecureWebsiteGuard', () => {
  let guard: SecureWebsiteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SecureWebsiteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
