import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentApiService } from './api/document-api.service';
import { Page } from './api/page.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AnnotationsService } from '../annotations/api/annotations.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss',
})
export class DocumentComponent {
  public isLoading = true;
  public pages?: Page[];
  public pageTitle?: string;

  public readonly documentId: string;
  public pageSizeInPx = 1040;
  public readonly maxHeight = 1500;
  public readonly minHeight = 900;
  scale = 1;
  public constructor(
    private readonly route: ActivatedRoute,
    private readonly documentApi: DocumentApiService,
    private readonly annotationsService: AnnotationsService
  ) {
    this.documentId = this.route.snapshot.params['id'];

    this.documentApi
      .getDocument(this.documentId)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.pages = value.pages;
        this.pageTitle = value.name;
        this.isLoading = false;
      });
  }

  public trackByFn(index: number, page: Page): number {
    return page.number;
  }

  public zoomInHandler(): void {
    this.zoomSetup();
  }

  public zoomOutHandler(): void {
    const zoomOut = true;
    this.zoomSetup(zoomOut);
  }

  public async saveAnnotations(): Promise<void> {
    const annotations = await this.annotationsService.saveAnnotations(
      this.documentId
    );
    console.log(annotations);
  }

  private zoomSetup(zoomOut?: boolean): void {
    if (zoomOut) {
      this.pageSizeInPx = Math.max(this.minHeight, this.pageSizeInPx - 100);
      return;
    }

    this.pageSizeInPx = Math.min(this.maxHeight, this.pageSizeInPx + 100);
  }
}
