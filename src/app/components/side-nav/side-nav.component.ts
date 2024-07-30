import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationSharedService } from 'src/app/services/authentication/authentication-shared.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  constructor(
    private authenticationService: AuthenticationSharedService,
    private router: Router
  ) {}

}
