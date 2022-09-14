import { TestBed } from '@angular/core/testing';

import { AccesoGuardGuard } from './acceso-guard.guard';

describe('AccesoGuardGuard', () => {
  let guard: AccesoGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccesoGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
