import {
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { AnnotationComponent } from './annotation/annotation.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnnotationsService } from './api/annotations.service';
import { AnnotationClass } from './api/annotation.class';

@Component({
  selector: 'app-annotations',
  templateUrl: './annotations.component.html',
  styleUrl: './annotations.component.scss',
})
export class AnnotationsComponent {
  @Input() public documentId!: string;
  @Input() public pageNumber!: number;
  @ViewChild('annotationsContainer')
  public annotationsContainer!: ElementRef<HTMLDivElement>;
  private isDrawing = false;

  private startX!: number;
  private startY!: number;

  private annotationRef: ComponentRef<AnnotationComponent> | null = null;
  private annotationRefs: Map<string, ComponentRef<AnnotationComponent>> =
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
      const id = String(Date.now());
      this.annotationRef.instance.id = id;
      this.annotationRef.instance.remove
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(id => {
          this.onRemoveAnnotation(id);
        });
      this.annotationRef.instance.changed
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(id => {
          this.onChangedAnnotation(id);
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
    void this.annotationsService.saveTempAnnotation(
      this.documentId,
      this.pageNumber,
      new AnnotationClass(this.annotationRef.instance)
    );
    this.isDrawing = false;
    this.annotationRef = null;
  };

  public constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly annotationsService: AnnotationsService
  ) {}

  private onRemoveAnnotation(id: string): void {
    const annotationRef = this.annotationRefs.get(id);
    if (!annotationRef) {
      return;
    }
    this.annotationRefs.delete(id);
    void this.annotationsService.deleteTempAnnotation(id);
    annotationRef.destroy();
  }

  private onChangedAnnotation(id: string): void {
    const annotationRef = this.annotationRefs.get(id);
    if (!annotationRef) {
      return;
    }
    void this.annotationsService.updateTempAnnotation(
      this.documentId,
      this.pageNumber,
      new AnnotationClass(annotationRef.instance)
    );
  }
}
