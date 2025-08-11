import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabalSolicitudesComponent } from "./components/tabal-solicitudes/tabal-solicitudes.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [NavbarComponent, TabalSolicitudesComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  userData: any;

  constructor(private authService: AuthService, private router: Router) {
    this.userData = this.authService.getUser();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
