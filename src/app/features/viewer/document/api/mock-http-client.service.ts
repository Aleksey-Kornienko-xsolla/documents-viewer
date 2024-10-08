import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { DocumentInterface } from './document.interface';
import { mockDocument } from './mock-document';

@Injectable()
export class MockHttpClientService {
  private readonly delay = 2000;
  public getDocument(id: string): Observable<DocumentInterface> {
    return of(mockDocument).pipe(delay(this.delay));
  }
}
