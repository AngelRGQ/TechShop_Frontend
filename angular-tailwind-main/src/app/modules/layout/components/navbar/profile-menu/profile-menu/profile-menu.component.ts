import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common';
import { ClickOutsideDirective } from 'src/app/shared/directives/click-outside.directive';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from 'src/app/core/services/theme.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { UsuarioSesion } from 'src/app/core/models/auth/usuario-sesion.model';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink, AngularSvgIconModule, CommonModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public isOpen = false;
  public submenuOpen: { [key: string]: boolean } = {}; 
  
  public profileMenu = [
    {
      title: 'Mi perfil',
      icon: './assets/icons/heroicons/outline/user-circle.svg',
      link: '/mi-perfil/general',
      hasSubmenu: false,
      external: false
    },
    {
      title: 'Contraseña',
      icon: './assets/icons/heroicons/outline/cog-6-tooth.svg',
      link: '',
      hasSubmenu: true,
      external: false,
      submenu: [
        {
          title: 'Cambiar contraseña',
          icon: './assets/icons/heroicons/outline/key.svg',
          link: '/mi-perfil/cambiar-password',
          external: false
        }
      ]
    },
    {
      title: 'Salir',
      icon: './assets/icons/heroicons/outline/logout.svg',
      link: '/auth/login',
      hasSubmenu: false,
      external: false
    },
  ];

  public foto: string = 'https://ui-avatars.com/api/?name=Usuario&background=e11d48&color=fff&size=128';
  public identity: UsuarioSesion | null = {
    id: 0,
    nombre: 'Usuario',
    email: '',
    rol: 'CLIENTE',
    activo: true
  };

  constructor(
    public themeService: ThemeService, 
    private authService: AuthService,
    private sessionService: SessionService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.identity = this.sessionService.getIdentity();
    const nombre = this.identity?.nombre || 'Usuario';
    this.foto = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=0f172a&color=fff&size=128`;
  }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleSubmenu(title: string): void {
    this.submenuOpen[title] = !this.submenuOpen[title];
  }

  navigateToLink(link: string, external: boolean = false): void {
    this.isOpen = false;
    
    if (external) {
      window.open(link, '_blank');
    } else {
      this._router.navigate([link]);
    }
  }

  executeLogoutFunction() {
    this.isOpen = false;
    this.authService.logout();
  }
}
