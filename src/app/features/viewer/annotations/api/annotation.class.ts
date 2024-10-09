import { Annotation } from './annotation.interface';
import { AnnotationComponent } from '../annotation/annotation.component';

export class AnnotationClass implements Annotation {
  public id: Annotation['id'];
  public type: Annotation['type'];
  public position: Annotation['position'];
  public value: Annotation['value'];

  public constructor(component: AnnotationComponent) {
    this.id = component.id;
    this.type = component.type;
    this.position = component.getSizes();
    this.value = component.getValue();
  }
}
