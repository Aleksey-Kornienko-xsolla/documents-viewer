import { Injectable } from '@angular/core';
import { Annotation } from './annotation.interface';
import { SavedAnnotationPayload } from './saved-annotation-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class MockApiClientService {
  private documentPagesKeysStore: Map<string, Set<number>> = new Map();
  private pagesAnnotationsIds: Map<string, string[]> = new Map();
  private annotationsStore: Map<string, Annotation> = new Map();

  public saveTempAnnotation(
    documentId: string,
    pageNumber: number,
    annotation: Annotation
  ): Promise<void> {
    return new Promise(resolve => {
      const storeKey = this.getTempStoreKey(documentId, pageNumber);
      const annotationsIds = this.getAnnotationsIds(storeKey);
      annotationsIds.push(annotation.id);
      this.pagesAnnotationsIds.set(storeKey, annotationsIds);
      this.annotationsStore.set(annotation.id, annotation);
      this.savePageKeyToStore(documentId, storeKey, pageNumber);
      resolve();
    });
  }

  public updateTempAnnotation(
    documentId: string,
    pageNumber: number,
    annotation: Annotation
  ): Promise<void> {
    return new Promise(resolve => {
      this.annotationsStore.set(annotation.id, annotation);
      resolve();
    });
  }

  public deleteAnnotation(annotationId: string): Promise<void> {
    return new Promise(resolve => {
      this.annotationsStore.delete(annotationId);
      resolve();
    });
  }

  public saveAnnotations(
    documentId: string
  ): Promise<Array<SavedAnnotationPayload>> {
    return new Promise(resolve => {
      const result: Array<SavedAnnotationPayload> = [];
      const pages = this.documentPagesKeysStore.get(documentId);

      if (!pages) {
        resolve(result);
        return;
      }

      Array.from(pages).forEach(page => {
        const key = this.getTempStoreKey(documentId, page);
        const annotationsIds = this.pagesAnnotationsIds.get(key);
        if (!annotationsIds) {
          return;
        }
        const annotations: Annotation[] = [];
        annotationsIds.forEach(annotationId => {
          const annotation = this.annotationsStore.get(annotationId);
          if (annotation) {
            annotations.push(annotation);
          }
        });

        if (annotations?.length) {
          result.push({
            page,
            annotations,
          });
        }
      });
      resolve(result);
    });
  }

  private getTempStoreKey(documentId: string, pageNumber: number): string {
    return `${documentId}_${pageNumber}`;
  }

  private getAnnotationsIds(storeKey: string): string[] {
    if (this.pagesAnnotationsIds.has(storeKey)) {
      return this.pagesAnnotationsIds.get(storeKey) as string[];
    }
    return [];
  }

  private savePageKeyToStore(
    documentId: string,
    storeKey: string,
    pageNumber: number
  ) {
    const pagesKeysStore =
      this.documentPagesKeysStore.get(documentId) ?? new Set<number>();
    pagesKeysStore.add(pageNumber);
    this.documentPagesKeysStore.set(documentId, pagesKeysStore);
  }
}
