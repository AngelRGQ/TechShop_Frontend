import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { CrearPedidoComponent } from './pages/crear-pedido/crear-pedido.component';
import { DetallePedidoComponent } from './pages/detalle-pedido/detalle-pedido.component';
import { MisPedidosComponent } from './pages/mis-pedidos/mis-pedidos.component';
import { PedidosPendientesComponent } from './pages/pedidos-pendientes/pedidos-pendientes.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'mis-pedidos', pathMatch: 'full' },
      { path: 'crear', component: CrearPedidoComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE'] } },
      { path: 'mis-pedidos', component: MisPedidosComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE'] } },
      { path: 'pendientes', component: PedidosPendientesComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } },
      { path: ':id', component: DetallePedidoComponent, canActivate: [RoleGuard], data: { roles: ['CLIENTE', 'ADMIN'] } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosRoutingModule {}
