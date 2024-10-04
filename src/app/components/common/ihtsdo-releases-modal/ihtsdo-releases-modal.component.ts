import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule} from '@ngx-translate/core';
import { CompareTextPipe } from 'src/app/pipes/compare-text/compare-text.pipe';
import { DateSortPipe } from 'src/app/pipes/date-sort/date-sort.pipe';

@Component({
  selector: 'app-ihtsdo-releases-modal',
  standalone: true,
  imports: [TranslateModule,CompareTextPipe,DateSortPipe,DatePipe,CommonModule],
  templateUrl: './ihtsdo-releases-modal.component.html',
  styleUrl: './ihtsdo-releases-modal.component.scss'
})
export class IhtsdoReleasesModalComponent {
  @Input() version: any;
  @Input() label: string | undefined;

}
