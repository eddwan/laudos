import { TestBed } from '@angular/core/testing';

import { LaudosRemoteService } from './laudos-remote.service';

describe('LaudosRemoteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaudosRemoteService = TestBed.get(LaudosRemoteService);
    expect(service).toBeTruthy();
  });
});
