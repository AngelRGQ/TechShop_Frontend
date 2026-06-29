import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'CLIENTE',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/shopping-cart.svg',
          label: 'Catalogo',
          route: '/catalogo',
        },
        {
          icon: 'assets/icons/heroicons/outline/plus-circle.svg',
          label: 'Crear Pedido',
          route: '/pedidos/crear',
        },
        {
          icon: 'assets/icons/heroicons/outline/clipboard-list.svg',
          label: 'Mis Pedidos',
          route: '/pedidos/mis-pedidos',
        },
        {
          icon: 'assets/icons/heroicons/solid/user.svg',
          label: 'Mi Perfil',
          route: '/mi-perfil/general',
        },
      ],
    },
    {
      group: 'VENTAS',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/document-text.svg',
          label: 'Pedidos',
          route: '/pedidos/pendientes',
        },
      ],
    },
    {
      group: 'ADMINISTRACION',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Usuarios',
          route: '/usuarios',
        },
        {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Productos',
          route: '/productos',
        },
      ],
    },
  ];
}
