import { TestBed } from '@angular/core/testing';

import { MockHttpClientService } from './mock-http-client.service';

describe('MockHttpClientService', () => {
  let service: MockHttpClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockHttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
