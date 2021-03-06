import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page, DialogEditarAutocompletar } from './tab3.page';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    MaterialModule
  ],
  declarations: [Tab3Page, DialogEditarAutocompletar],
  entryComponents: [DialogEditarAutocompletar]
})
export class Tab3PageModule {}
