import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabalSolicitudesComponent } from "./components/tabal-solicitudes/tabal-solicitudes.component";
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-admin',
  imports: [TabalSolicitudesComponent, NavbarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent { }
