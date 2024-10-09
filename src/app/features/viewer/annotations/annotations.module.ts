import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnotationsRoutingModule } from './annotations-routing.module';
import { AnnotationsComponent } from './annotations.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AnnotationsComponent, AnnotationComponent],
  exports: [AnnotationsComponent],
  imports: [
    CommonModule,
    AnnotationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AnnotationsModule {}
