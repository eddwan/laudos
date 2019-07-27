import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HisteroscopiaPage } from './histeroscopia.page';
import { MaterialModule} from '../../material.module';

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
    MaterialModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [HisteroscopiaPage]
})
export class HisteroscopiaPageModule {}
