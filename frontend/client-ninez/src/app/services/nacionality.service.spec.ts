import { TestBed } from '@angular/core/testing';

import { NacionalityService } from './nacionality.service';

describe('NacionalityService', () => {
  let service: NacionalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NacionalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
