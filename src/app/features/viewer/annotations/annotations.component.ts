import {
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AnnotationComponent } from './annotation/annotation.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations.component.html',
  styleUrl: './annotations.component.scss',
})
export class AnnotationsComponent {
  @ViewChild('annotationsContainer')
  public annotationsContainer!: ElementRef<HTMLDivElement>;
  private isDrawing = false;

  private startX!: number;
  private startY!: number;

  private annotationRef: ComponentRef<AnnotationComponent> | null = null;
  private annotationRefs: Map<number, ComponentRef<AnnotationComponent>> =
    new Map();
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @HostListener('mousedown', ['$event'])
  private readonly onMouseDownHandler = (event: MouseEvent) => {
    if (!this.isDrawing) {
      this.isDrawing = true;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
      this.annotationRef =
        this.viewContainerRef.createComponent(AnnotationComponent);

      this.annotationRef.instance.setPosition(this.startX, this.startY);
      const id = Date.now();
      this.annotationRef.instance.id = id;
      this.annotationRef.instance.remove
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(id => {
          this.removeAnnotation(id);
        });

      this.annotationRefs.set(id, this.annotationRef);
    }
  };

  @HostListener('mousemove', ['$event'])
  private readonly onMouseMoveHandler = (event: MouseEvent) => {
    if (!this.isDrawing || !this.annotationRef) {
      return;
    }

    const currentX = event.offsetX - this.startX;
    const currentY = event.offsetY - this.startY;
    this.annotationRef.instance.setSize(currentX, currentY);
  };

  @HostListener('mouseup', ['$event'])
  private readonly onMouseUpHandler = (event: MouseEvent) => {
    if (!this.isDrawing || !this.annotationRef) {
      return;
    }

    const currentX = event.offsetX - this.startX;
    const currentY = event.offsetY - this.startY;
    this.annotationRef.instance.setSize(currentX, currentY);
    this.isDrawing = false;
    this.annotationRef = null;
  };

  public constructor(private readonly viewContainerRef: ViewContainerRef) {}

  private removeAnnotation(id: number): void {
    const annotationRef = this.annotationRefs.get(id);
    if (!annotationRef) {
      return;
    }
    this.annotationRefs.delete(id);
    annotationRef.destroy();
  }
}
