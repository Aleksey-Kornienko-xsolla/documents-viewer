import { TestBed } from '@angular/core/testing';

import { MockApiClientService } from './mock-api-client.service';

describe('MockApiClientService', () => {
  let service: MockApiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockApiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
