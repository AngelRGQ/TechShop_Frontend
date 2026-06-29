import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      {
        path: 'mi-perfil',
        loadChildren: () => import('../mi-perfil/mi-perfil.module').then((m) => m.MiPerfilModule),
      },
      {
        path: 'catalogo',
        loadChildren: () => import('../productos/productos.module').then((m) => m.ProductosModule),
      },
      {
        path: 'productos',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('../productos/productos.module').then((m) => m.ProductosModule),
      },
      {
        path: 'usuarios',
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('../usuarios/usuarios.module').then((m) => m.UsuariosModule),
      },
      {
        path: 'pedidos',
        loadChildren: () => import('../pedidos/pedidos.module').then((m) => m.PedidosModule),
      },
      { path: '**', redirectTo: '/errors/404', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
