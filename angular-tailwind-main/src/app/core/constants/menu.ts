import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
     {
      group: 'TRABAJADOR',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/solid/user.svg',
          label: 'Trabajador',
          route: '/trabajador',
          children: [
            { label: 'Mi perfil', route: '/mi-perfil/mi-perfil' },
            { label: 'Mis Reportes', route: '/trabajador/listado-mis-reportes' },
          ],
        },
      ],
    },
    {
      group: 'HSE',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/document-text.svg',
          label: 'Reportes',
          route: '/hse/reportes',
          children: [
            { label: 'Listado de reportes', route: '/hse/reportes/listado-general-reportes' },
            { label: 'Reporte', route: '/hse/reportes/reporte' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/chat-bar.svg',
          label: 'Tarjetas estadísticas',
          route: '/hse/estadisticas',
        },
      ],
      
    }


  ];
}