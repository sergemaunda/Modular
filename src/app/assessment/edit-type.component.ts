import { Component, OnInit } from '@angular/core';
import { AssessmentService } from './assessment.service';

@Component({
    template: `
    <ion-content color="dark">
      <ion-item color="warning" lines="none" detail="false">
          <ion-title  class="ion-text-wrap">Type</ion-title>
          <ion-button (click)="cancel()" fill="clear" color="light" slot="end">
              <h2><ion-icon name="close" slot="end"></ion-icon></h2>
          </ion-button>
      </ion-item>

      <ion-card-content>
          <ion-item lines="inset" detail="false" color="dark">
              <ion-label position="floating">Name</ion-label>
              <ion-input [(ngModel)]="type.name" type="text" maxlength="20" (ionChange)="typeChange()"></ion-input>
          </ion-item>
      </ion-card-content>
      <ion-card-content>
          <ion-button [disabled]="disableButton" (click)="save()" color="warning" expand="block">Save</ion-button>
      </ion-card-content>
    </ion-content>
    `,

    styleUrls: ['./assessment.page.scss']
})

export class EditTypeComponent implements OnInit {
    index = this.assessService.editTypeId;
    type = this.assessService.types[this.index];

    savedName: string;
    disableButton: boolean;

    constructor(private assessService: AssessmentService) {
    }

    ngOnInit() {
        this.savedName = this.type.name;
        this.disableButton = true;
    }

    typeChange() {
        this.disableButton = this.savedName === this.type.name;
    }

    async save() {

        if (this.type.name.trim() === '' || this.type.color === undefined) {
            this.assessService.presentAlert('Assessment', 'Fill in assessment name', ['OK']);
        } else {
            await this.assessService.modalCtrl.dismiss().then(() => {
                this.assessService.types[this.index].name = this.type.name;

                this.assessService.weekAssessments.forEach((week) => {
                    week.assessment.forEach((assessment) => {
                        if (assessment.type.name === this.savedName) {
                            assessment.type.name = this.type.name;
                        }
                    });
                });

                this.assessService.tbcAssessments.forEach((assessment) => {
                  if (assessment.type.name === this.savedName) {
                      assessment.type.name = this.type.name;
                  }
                });

                this.assessService.currentMonthAssessments.forEach((assessment) => {
                    if (assessment.type.name === this.savedName) {
                        assessment.type.name = this.type.name;
                    }
                });

                this.assessService.monthAssessments.forEach((month) => {
                    month.assessment.forEach((assessment) => {
                        if (assessment.type.name === this.savedName) {
                            assessment.type.name = this.type.name;
                        }
                    });
                });

                this.assessService.storeTypes();
                this.assessService.storetbcAssessments();
                this.assessService.storeCurrentMonthAssessments();
                this.assessService.storeMonthAssessments();
                this.assessService.presentToast('Edit saved!');
            });
            this.disableButton = true;
        }
    }

    async cancel() {
        this.type.name = this.savedName;
        await this.assessService.modalCtrl.dismiss();
    }
}
