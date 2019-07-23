import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HisteroscopiaPage } from './histeroscopia.page';

const routes: Routes = [
  {
    path: '',
    component: HisteroscopiaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HisteroscopiaPage]
})
export class HisteroscopiaPageModule {}
