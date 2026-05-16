import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ResourceService } from './resource';

describe('ResourceService', () => {
  let service: ResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(ResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
