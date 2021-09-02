import { Component, OnInit } from '@angular/core';
import { AssessmentService } from './assessment.service';

@Component({
    template: `
    <ion-content color="dark">
      <ion-item color="warning" lines="none" detail="false">
          <ion-title  class="ion-text-wrap" class="font-label">Type</ion-title>
          <ion-button (click)="cancel()" fill="clear" color="light" slot="end">
              <h2><ion-icon name="close" slot="end"></ion-icon></h2>
          </ion-button>
      </ion-item>

      <ion-card-content>
          <ion-item lines="inset" detail="false" color="dark">
              <ion-label position="floating">Name</ion-label>
              <ion-input [(ngModel)]="name" type="text" maxlength="20"></ion-input>
          </ion-item>
      </ion-card-content>
      <ion-card-content>
          <ion-button [disabled]="disableButton" (click)="add()" color="warning" expand="block">Add</ion-button>
      </ion-card-content>
    </ion-content>
    `,

    styleUrls: ['./assessment.page.scss']
})

export class AddTypeComponent implements OnInit {
    // TODO - Add colorpicker
    // Study/task
    name: string;
    disableButton: boolean;

    constructor(private assessService: AssessmentService) {
    }

    ngOnInit() {
        this.disableButton = false;
    }

    async add() {
        let isValid = true;

        if (this.name.trim() === '') {
            this.assessService.presentAlert('Assessment', 'Fill in assessment name', ['OK']);
            isValid = false;
        }

        if (this.typeExists() === true) {
            this.assessService.presentAlert('Assessment', 'Assessment type already exists!', ['OK']);
            isValid = false;
        }

        if (isValid === true) {
            await this.assessService.modalCtrl.dismiss().then(() => {
                this.assessService.types.push({
                    id: undefined,
                    name: this.name,
                });
                this.assessService.type = this.assessService.types[this.assessService.types.length - 1];
                this.assessService.assignTypeID();
                this.assessService.storeTypes();
            });
            this.disableButton = true;
        }
    }

    typeExists(): boolean {
        let exists = false;
        const typeName = this.name.trim();
        this.assessService.types.forEach(type => {
            if (type.name.toLowerCase() === typeName.toLowerCase()) {
                exists = true;
            }
        });

        if ((typeName.toLowerCase() === 'test') ||
            (typeName.toLowerCase() === 'exam') ||
            (typeName.toLowerCase() === 'assignment') ||
            (typeName.toLowerCase() === 'report')) {
            exists = true;
        }

        return exists;
    }

    async cancel() {
        await this.assessService.modalCtrl.dismiss();
    }

}
