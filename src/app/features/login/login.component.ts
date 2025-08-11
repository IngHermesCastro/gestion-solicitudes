import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const token = await this.authService.login(this.email, this.password);

      // Puedes llamar al backend si lo necesitas
      // await fetch('/api/verificarToken', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.error = 'Error al iniciar sesión';
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
