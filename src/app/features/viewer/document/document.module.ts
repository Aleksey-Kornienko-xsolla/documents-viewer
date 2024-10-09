import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentRoutingModule } from './document-routing.module';
import { DocumentComponent } from './document.component';
import { DocumentApiService } from './api/document-api.service';
import { MockHttpClientService } from './api/mock-http-client.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PageComponent } from './page/page.component';
import { AnnotationsModule } from '../annotations/annotations.module';

@NgModule({
  declarations: [DocumentComponent, PageComponent],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    ScrollingModule,
    AnnotationsModule,
  ],
  providers: [DocumentApiService, MockHttpClientService],
  exports: [DocumentComponent],
})
export class DocumentModule {}
