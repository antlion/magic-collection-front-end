import { TestBed } from '@angular/core/testing';

import { SearchCardService } from './search-card.service';

describe('SearchCardService', () => {
  let service: SearchCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
