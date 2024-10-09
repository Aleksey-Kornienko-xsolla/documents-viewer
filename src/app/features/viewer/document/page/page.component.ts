import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  @Input() public imageUrl!: string;
  @Input() public documentId!: string;
  @Input() public pageNumber!: number;
}
