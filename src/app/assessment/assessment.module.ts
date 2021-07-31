import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssessmentPageRoutingModule } from './assessment-routing.module';
import { AssessmentPage } from './assessment.page';
import { AddAssessmentComponent } from './add-assessment.component';
import { EditAssessmentComponent } from './edit-assessment.component';
import { AddModuleComponent } from './add-module.component';
import { AddTypeComponent } from './add-type.component';
import { EditModuleComponent } from './edit-module.component';
import { EditTypeComponent } from './edit-type.component';
import { ShowModuleComponent } from './show-module.component';
import { ShowTypeComponent } from './show-type.component';
import { AssessmentService } from './assessment.service';
import { OptionsComponent } from './options.component';
import { SettingsPage } from './settings.page';
import { FilterComponent } from './filter.component';
import { RemindersComponent } from './reminders.component';



@NgModule({
  entryComponents: [AddAssessmentComponent, AddTypeComponent, EditAssessmentComponent, OptionsComponent, FilterComponent,
    AddModuleComponent, EditModuleComponent, EditTypeComponent, ShowModuleComponent, ShowTypeComponent, SettingsPage, RemindersComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssessmentPageRoutingModule
  ],
  declarations: [AssessmentPage, EditAssessmentComponent, OptionsComponent,
    AddAssessmentComponent, AddTypeComponent, AddModuleComponent, EditModuleComponent, EditTypeComponent,
     ShowModuleComponent, ShowTypeComponent, SettingsPage, FilterComponent,RemindersComponent ],
  providers: [AddAssessmentComponent, EditAssessmentComponent, OptionsComponent,
    AddModuleComponent, AddTypeComponent, EditModuleComponent, EditTypeComponent, ShowModuleComponent, ShowTypeComponent,
     AssessmentService, SettingsPage, FilterComponent,RemindersComponent ]
})
export class AssessmentPageModule {}
