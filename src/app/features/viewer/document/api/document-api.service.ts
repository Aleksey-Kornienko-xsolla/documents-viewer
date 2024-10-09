import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentInterface } from './document.interface';
import { MockHttpClientService } from './mock-http-client.service';

@Injectable()
export class DocumentApiService {
  public constructor(private readonly httpClient: MockHttpClientService) {}

  public getDocument(id: string): Observable<DocumentInterface> {
    return this.httpClient.getDocument(id);
  }
}
