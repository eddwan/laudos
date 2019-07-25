import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'histeroscopia', loadChildren: './laudo/histeroscopia/histeroscopia.module#HisteroscopiaPageModule' },
  { path: 'histeroscopia/:filename', loadChildren: './laudo/histeroscopia/histeroscopia.module#HisteroscopiaPageModule' },
  { path: 'laparoscopia', loadChildren: './laudo/laparoscopia/laparoscopia.module#LaparoscopiaPageModule' }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
