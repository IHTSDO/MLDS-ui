import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule} from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { RemoveHtmlPipe } from 'src/app/pipes/remove-html/remove-html.pipe';

@Component({
    selector: 'app-ihtsdo-releases-modal',
    imports: [TranslateModule, CompareTextPipe, DatePipe, CommonModule, RemoveHtmlPipe],
    templateUrl: './ihtsdo-releases-modal.component.html',
    styleUrl: './ihtsdo-releases-modal.component.scss'
})
export class IhtsdoReleasesModalComponent {
  @Input() version: any;
  @Input() label: string | undefined;

}
