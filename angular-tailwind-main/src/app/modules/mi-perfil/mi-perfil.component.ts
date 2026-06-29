import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './mi-perfil.component.html',
  styles: ``
})
export class MiPerfilComponent {
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}