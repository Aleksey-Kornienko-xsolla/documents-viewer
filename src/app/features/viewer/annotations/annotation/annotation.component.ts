import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
})
export class AnnotationComponent {
  @Output() remove = new EventEmitter<number>();
  @Input() id!: number;

  public type?: string;
  public imageSrc: string | ArrayBuffer | null = null;

  private annotationPositionX: number | null = null;
  private annotationPositionY: number | null = null;
  @HostListener('mousedown', ['$event'])
  private readonly onMouseDownHandler = (event: MouseEvent) => {
    const element = this.renderer.selectRootElement(
      this.elementRef.nativeElement,
      true
    );
    this.annotationPositionX = element.offsetLeft;
    this.annotationPositionY = element.offsetTop;
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
  }

  public removeAnnotation(): void {
    this.remove.emit(this.id);
  }

  public setAnnotationType(type: string) {
    this.type = type;
  }
  public onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private stopMovement(): void {
    this.annotationPositionX = null;
    this.annotationPositionY = null;
  }
}
