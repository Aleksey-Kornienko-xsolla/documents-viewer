import { Injectable } from '@angular/core';
import { Annotation } from './annotation.interface';
import { MockApiClientService } from './mock-api-client.service';
import { SavedAnnotationPayload } from './saved-annotation-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class AnnotationsService {
  public constructor(private readonly client: MockApiClientService) {}

  public saveTempAnnotation(
    documentId: string,
    pageNumber: number,
    annotation: Annotation
  ): Promise<void> {
    return this.client.saveTempAnnotation(documentId, pageNumber, annotation);
  }

  public updateTempAnnotation(
    documentId: string,
    pageNumber: number,
    annotation: Annotation
  ): Promise<void> {
    return this.client.updateTempAnnotation(documentId, pageNumber, annotation);
  }

  public deleteTempAnnotation(annotationId: string): Promise<void> {
    return this.client.deleteAnnotation(annotationId);
  }

  public saveAnnotations(
    documentId: string
  ): Promise<Array<SavedAnnotationPayload>> {
    return this.client.saveAnnotations(documentId);
  }
}
