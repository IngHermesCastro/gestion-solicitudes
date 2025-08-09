import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {


  constructor(private router: Router) { }

  navigateToSolicitud(): void {
    this.router.navigate(['/solicitud']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
