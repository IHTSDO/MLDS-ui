import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { RemoveHtmlPipe } from 'src/app/pipes/remove-html/remove-html.pipe';

@Component({
    selector: 'app-ihtsdo-release-version-modal',
    imports: [CommonModule, TranslateModule, CompareTextPipe, RemoveHtmlPipe],
    templateUrl: './ihtsdo-release-version-modal.component.html',
    styleUrl: './ihtsdo-release-version-modal.component.scss'
})
export class IhtsdoReleaseVersionModalComponent {
  @Input() releaseVersion!: any;
}
