import { annotationTypes } from './annotation-types.type';
import { AnnotationPositions } from '../annotation/annotation-positions.interface';

export interface Annotation {
  id: string;
  type?: annotationTypes;
  value?: string | File | null;
  position: AnnotationPositions;
}
