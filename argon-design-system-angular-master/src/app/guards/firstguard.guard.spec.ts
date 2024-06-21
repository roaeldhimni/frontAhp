import { TestBed } from '@angular/core/testing';

import { FirstguardGuard } from './firstguard.guard';

describe('FirstguardGuard', () => {
  let guard: FirstguardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FirstguardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
