import { TestBed } from '@angular/core/testing';

import { UtilsFunctionsService } from './utils-functions.service';

describe('UtilsFunctionsService', () => {
  let service: UtilsFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
