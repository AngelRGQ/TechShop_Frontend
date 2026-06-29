import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiPerfilComponent } from './mi-perfil.component';
import { GeneralComponent } from './general/general.component';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';

const routes: Routes = [ {
  path: '',
  component: MiPerfilComponent,
  children: [
    { path: '', redirectTo: 'general', pathMatch: 'full' },
    { path: 'general', component: GeneralComponent },
    { path: 'cambiar-password', component: CambiarPasswordComponent },
    { path: '**', redirectTo: '/errors/404' },
  ],
},];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiPerfilRoutingModule { }
