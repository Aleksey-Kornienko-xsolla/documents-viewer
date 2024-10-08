import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentApiService } from './api/document-api.service';
import { Page } from './api/page.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss',
})
export class DocumentComponent implements OnInit {
  public isLoading = true;
  public pages?: Page[];
  public pageTitle?: string;

  public pageSizeInPx = 1040;
  public readonly maxHeight = 1500;
  public readonly minHeight = 900;
  private readonly documentId: string;
  public constructor(
    private readonly route: ActivatedRoute,
    private readonly documentApi: DocumentApiService
  ) {
    this.documentId = this.route.snapshot.params['id'];

    this.documentApi
      .getDocument(this.documentId)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        console.log(value);
        this.pages = value.pages;
        this.pageTitle = value.name;
        this.isLoading = false;
      });
  }

  public ngOnInit(): void {
    console.log(this.documentId);
    // todo load document info

    // this.documentApi.getDocument(this.documentId).subscribe(document => {
    //   console.log(document);
    //   this.pages = document.pages;
    //   this.isLoading = false;
    // });
  }

  public zoomInHandler(): void {
    this.zoomSetup();
  }

  public zoomOutHandler(): void {
    const zoomOut = true;
    this.zoomSetup(zoomOut);
  }

  private zoomSetup(zoomOut?: boolean): void {
    if (zoomOut) {
      this.pageSizeInPx = Math.max(this.minHeight, this.pageSizeInPx - 100);
      return;
    }

    this.pageSizeInPx = Math.min(this.maxHeight, this.pageSizeInPx + 100);
  }
}
