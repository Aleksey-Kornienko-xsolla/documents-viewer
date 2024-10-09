import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { annotationTypes } from '../api/annotation-types.type';
import { AnnotationPositions } from './annotation-positions.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
})
export class AnnotationComponent {
  @Output() public remove = new EventEmitter<string>();
  @Output() public changed = new EventEmitter<string>();
  @Input() public id!: string;

  public type?: annotationTypes;
  public imageSrc: string | ArrayBuffer | null = null;
  public formControl = new FormControl();

  private annotationPositionX: number | null = null;
  private annotationPositionY: number | null = null;
  private width!: number;
  private height!: number;
  private annotationXCoordinate!: number;
  private annotationYCoordinate!: number;
  private imageFile?: File;

  @HostListener('mousedown', ['$event'])
  private readonly onMouseDownHandler = () => {
    this.annotationPositionX = this.annotationXCoordinate;
    this.annotationPositionY = this.annotationYCoordinate;
  };

  @HostListener('mousemove', ['$event'])
  private readonly onMouseMoveHandler = (event: MouseEvent) => {
    if (!this.annotationPositionX || !this.annotationPositionY) {
      return;
    }
    this.annotationPositionX += event.movementX;
    this.annotationPositionY += event.movementY;

    this.setPosition(this.annotationPositionX, this.annotationPositionY);
  };

  @HostListener('mouseup', ['$event'])
  private readonly onMouseUpHandler = () => {
    this.stopMovement();
  };

  @HostListener('mouseleave', ['$event'])
  private readonly onMouseLeaveHandler = () => {
    this.stopMovement();
  };
  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  public setPosition(x: number, y: number): void {
    this.annotationXCoordinate = x;
    this.annotationYCoordinate = y;
    this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${x}px`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${y}px`);
  }

  public setSize(width: number, height: number): void {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'width',
      `${width}px`
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'height',
      `${height}px`
    );

    this.width = width;
    this.height = height;
  }

  public removeAnnotation(): void {
    this.remove.emit(this.id);
  }

  public setAnnotationType(type: annotationTypes) {
    this.type = type;
  }
  public onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.imageFile = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageSrc = reader.result;
        this.changed.emit(this.id);
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  public updateTextValue(): void {
    this.changed.emit(this.id);
  }

  public getSizes(): AnnotationPositions {
    return {
      x: this.annotationXCoordinate,
      y: this.annotationYCoordinate,
      width: this.width,
      height: this.height,
    };
  }

  public getValue(): string | File | null | undefined {
    if (this.type === 'image') {
      return this.imageFile;
    }
    if (this.type === 'text') {
      return this.formControl.value;
    }
    return null;
  }

  private stopMovement(): void {
    this.annotationPositionX = null;
    this.annotationPositionY = null;
    this.changed.emit(this.id);
  }
}
