import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CompareTextPipe } from "../../../pipes/compare-text/compare-text.pipe";

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [TranslateModule, CompareTextPipe],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent {

}
