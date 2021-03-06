import { Component } from '@angular/core';
import { AddTypeComponent } from '../assessment/add-type.component';
import { EditTypeComponent } from '../assessment/edit-type.component';
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
        <ion-title class="font-app-title">Types</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addType()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content color="dark" class="ion-padding">
    <ion-item  color="dark" detail="false" *ngFor="let type of this.assessService.types">
    <ion-icon slot="start" name="flask-outline"></ion-icon>
    <ion-icon (click)="presentDeleteAlert(type.id)" slot="end" name="trash-outline" color="danger"></ion-icon>
    <ion-label (click)="editType(type.id)" class="ion-text-wrap">
        <h2><b>{{type.name}}</b></h2>
    </ion-label>
    </ion-item>
    <ion-item disabled color="dark" detail="false" *ngFor="let type of this.assessService.defaultTypes">
      <ion-icon slot="start" name="flask-outline"></ion-icon>
      <ion-label class="ion-text-wrap">
          <h2><b>{{ type.name }}</b></h2>
      </ion-label>
    </ion-item>
    </ion-content>
    `,
    styleUrls: ['./assessment.page.scss']
})

export class ShowTypeComponent {
    constructor(public assessService: AssessmentService,
                private alertCtrl: AlertController) {
    }

    async presentDeleteAlert(id: number) {
      const alert = await this.alertCtrl.create({
        header: 'Module',
        message: 'Are you sure you want to delete this assessment type?',
        buttons: [{text: 'No', handler: () => {this.alertCtrl.dismiss(); }},
        {text: 'Yes', handler: () => {this.deleteType(id); }}]
      });
      await alert.present();
    }


    addType() {
      console.dir(this.assessService.types);
      this.assessService.presentModal(AddTypeComponent);
    }

    editType(id: number) {
      this.assessService.editTypeId = id;
      this.assessService.presentModal(EditTypeComponent);
    }


    deleteType(id: any) {
      this.assessService.types.splice(id, 1);
      this.assessService.assignTypeID();
      this.assessService.storeTypes();
    }

    async returnSettings() {
      await this.assessService.modalCtrl.dismiss().then(() => {});
    }
}
