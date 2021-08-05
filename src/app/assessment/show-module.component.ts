import { Component } from '@angular/core';
import { AddModuleComponent } from '../assessment/add-module.component';
import { EditModuleComponent } from '../assessment/edit-module.component';
import { FilterComponent } from '../assessment/filter.component';
import { AssessmentService } from './assessment.service';
import { AlertController } from '@ionic/angular';

@Component({
    template: `

  <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
            <ion-button (click)="returnSettings()">
                <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
            </ion-button>
        </ion-buttons>
        <ion-title class="font-app-title">Modules</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addModule()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content color="dark" class="ion-padding">
        <ion-item color="dark" detail="false" *ngFor="let module of this.assessService.modules">
          <ion-icon name="library-outline" color="light" slot="start"></ion-icon>
          <ion-icon (click)="presentDeleteAlert(module.id, module.code)" slot="end" name="trash-outline" color="danger"></ion-icon>
          <ion-label (click)="editModule(module.id)" class="ion-text-wrap">
            <ion-badge color="warning">{{module.lecturer}}</ion-badge>
            <h2><b>{{module.code}}</b></h2>
            <h6><b>{{module.name}}</b></h6>
          </ion-label>
        </ion-item>
    </ion-content>
    `,
    styleUrls: ['./assessment.page.scss']
})

export class ShowModuleComponent {
    constructor(public assessService: AssessmentService,
                private filter: FilterComponent,
                private alertCtrl: AlertController) {
    }

    async presentDeleteAlert(id: number, moduleCode: string) {
      const alert = await this.alertCtrl.create({
        header: 'Module',
        message: 'Are you sure you want to delete ' + moduleCode + '?',
        buttons: [{text: 'No', handler: () => {this.alertCtrl.dismiss(); }},
        {text: 'Yes', handler: () => {this.deleteModule(id); }}]
      });
      await alert.present();
    }

    addModule() {
      this.assessService.presentModal(AddModuleComponent);
    }

    editModule(id: number) {
      this.assessService.editModuleId = id;
      this.assessService.presentModal(EditModuleComponent);
    }

    deleteModule(id: number) {
      if ( (this.assessService.filters.selectedFilter === this.assessService.modules[id].code)) {
        this.filter.removeFilter(this.assessService.newId);
      }
      this.assessService.modules.splice(id, 1);
      this.assessService.assignModuleID();
      this.assessService.storeModules();
    }

    async returnSettings() {
      await this.assessService.modalCtrl.dismiss().then(() => {});
    }
}
