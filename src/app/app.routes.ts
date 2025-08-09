import { Routes } from '@angular/router';

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
  }




];
