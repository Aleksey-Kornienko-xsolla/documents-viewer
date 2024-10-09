import { Annotation } from './annotation.interface';

export interface SavedAnnotationPayload {
  page: number;
  annotations: Array<Annotation>;
}
