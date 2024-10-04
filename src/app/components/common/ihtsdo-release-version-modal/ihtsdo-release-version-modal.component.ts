import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';

@Component({
  selector: 'app-ihtsdo-release-version-modal',
  standalone: true,
  imports: [CommonModule,TranslateModule,CompareTextPipe],
  templateUrl: './ihtsdo-release-version-modal.component.html',
  styleUrl: './ihtsdo-release-version-modal.component.scss'
})
export class IhtsdoReleaseVersionModalComponent {
  @Input() releaseVersion!: any;
}
