import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-password-strength-bar',
  standalone: true,
  imports: [],
  templateUrl: './password-strength-bar.component.html',
  styleUrl: './password-strength-bar.component.scss'
})
export class PasswordStrengthBarComponent implements OnChanges {
  @Input() passwordToCheck: string = '';
  strength: number = 0;
  strengthColor: string = 'red';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['passwordToCheck']) {
      this.calculateStrength(this.passwordToCheck);
    }
  }

  private calculateStrength(password: string): void {
    const lengthCriteria = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    this.strength = (lengthCriteria ? 1 : 0) +
                    (hasUppercase ? 1 : 0) +
                    (hasLowercase ? 1 : 0) +
                    (hasNumber ? 1 : 0) +
                    (hasSpecialChar ? 1 : 0);

    this.updateStrengthColor();
  }

  private updateStrengthColor(): void {
    switch (this.strength) {
      case 5:
        this.strengthColor = 'green';
        break;
      case 4:
        this.strengthColor = 'blue';
        break;
      case 3:
        this.strengthColor = 'orange';
        break;
      default:
        this.strengthColor = 'red';
        break;
    }
  }
}