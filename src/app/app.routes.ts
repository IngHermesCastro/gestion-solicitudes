import { Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then(m => m.routes)
  },
  {
    path: 'login',
    loadChildren: () => import('./features/login/login.routes').then(m => m.routes)
  },
  {
    path: 'solicitud',
    loadChildren: () => import('./features/solicitudes/solicitud.routes').then(m => m.routes)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },





];
