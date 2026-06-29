import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioSesion } from 'src/app/core/models/auth/usuario-sesion.model';
import { SessionService } from 'src/app/core/services/session/session.service';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements OnInit {
  perfil: UsuarioSesion | null = null;
  error = '';
  mensaje = '';
  loading = true;
  saving = false;
  nombre = '';
  celular = '';

  constructor(
    private usuarioService: UsuarioService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.perfil = this.sessionService.getIdentity();
    this.nombre = this.perfil?.nombre || '';
    this.celular = this.perfil?.celular || '';

    this.usuarioService.obtenerPerfil().subscribe({
      next: (response) => {
        this.perfil = response.data;
        this.nombre = response.data.nombre;
        this.celular = response.data.celular || '';
        this.loading = false;
      },
      error: () => {
        this.error = 'Mostrando datos de la sesion actual mientras se implementa GET /auth/perfil en backend.';
        this.loading = false;
      },
    });
  }

  guardar(): void {
    if (!this.nombre.trim() || !this.celular.trim()) {
      this.error = 'Nombre y celular son obligatorios.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.mensaje = '';

    this.usuarioService.actualizarPerfil({ nombre: this.nombre.trim(), celular: this.celular.trim() }).subscribe({
      next: (response) => {
        this.perfil = response.data;
        this.sessionService.updateIdentity(response.data);
        this.mensaje = 'Perfil actualizado correctamente.';
        this.saving = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'No se pudo actualizar el perfil.';
        this.saving = false;
      },
    });
  }
}
