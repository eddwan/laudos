import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { UserAuthenticationComponent } from './auth/user-authentication.component';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'histeroscopia', loadChildren: './laudo/histeroscopia/histeroscopia.module#HisteroscopiaPageModule' },
  { path: 'histeroscopia/:filename', loadChildren: './laudo/histeroscopia/histeroscopia.module#HisteroscopiaPageModule' },
  { path: 'laparoscopia', loadChildren: './laudo/laparoscopia/laparoscopia.module#LaparoscopiaPageModule' },
  { path: 'laparoscopia/:filename', loadChildren: './laudo/laparoscopia/laparoscopia.module#LaparoscopiaPageModule' },
  { path: 'modelos/histeroscopia', loadChildren: './modelos/histeroscopia/histeroscopia.module#HisteroscopiaPageModule' },
  { path: 'modelos/laparoscopia', loadChildren: './modelos/laparoscopia/laparoscopia.module#LaparoscopiaPageModule' },
  { path: 'tab4', loadChildren: './tab4/tab4.module#Tab4PageModule' },
  { path: 'login', component: UserAuthenticationComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
