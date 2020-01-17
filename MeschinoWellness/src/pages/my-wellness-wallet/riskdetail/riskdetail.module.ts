import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RiskDetailPage } from './riskdetail';

@NgModule({
  declarations: [
    RiskDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RiskDetailPage),
  ],
})
export class RiskDetailPageModule {}
