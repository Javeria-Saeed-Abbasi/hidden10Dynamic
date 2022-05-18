import { TestBed } from '@angular/core/testing';

import { SecureInnerPagesGuardGuard } from './secure-inner-pages-guard.guard';

describe('SecureInnerPagesGuardGuard', () => {
  let guard: SecureInnerPagesGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SecureInnerPagesGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
