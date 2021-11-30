import { Component, OnInit } from '@angular/core';
import { AssessmentService } from './assessment.service';

@Component({
    template: `
    <ion-content color="dark">
    <ion-item color="warning" lines="none" detail="false">
        <ion-title>Module</ion-title>
        <ion-button (click)="cancel()" fill="clear" color="light" slot="end">
            <h2><ion-icon name="close" slot="end"></ion-icon></h2>
        </ion-button>
    </ion-item>

    <ion-card-content>
        <ion-item lines="inset" color="dark">
            <ion-label position="floating">Name</ion-label>
            <ion-input [(ngModel)]="module.name" type="text"></ion-input>
        </ion-item>
        <ion-item lines="inset" color="dark">
            <ion-label position="floating">Code</ion-label>
            <ion-input [(ngModel)]="module.code" (ionChange)="onInput()"  type="text" maxlength="15"
            style="text-transform:uppercase">
            </ion-input>
        </ion-item>
        <p style="color:grey;font-size: 9px; text-align: right">{{ codeLength }}/15</p>
    </ion-card-content>
    <ion-card-content>
        <ion-item lines="inset" color="dark">
          <ion-icon name="person-outline" slot="start" size="large"></ion-icon>
            <ion-label position="floating">Lecturer</ion-label>
            <ion-input [(ngModel)]="module.lecturer" type="text"></ion-input>
        </ion-item>
    </ion-card-content>
    <ion-card-content>
        <ion-button [disabled]="disableButton" (click)="add()" color="warning" expand="block">Add</ion-button>
    </ion-card-content>
      </ion-content>
    `,

    styleUrls: ['./assessment.page.scss']
})

export class AddModuleComponent implements OnInit {
    module = {name: '', code: '', lecturer: ''};
    codeLength: number;
    disableButton: boolean;

    constructor(private assessService: AssessmentService) {
    }

    ngOnInit() {
        this.codeLength = 0;
        this.disableButton = false;
    }

    onInput() {
        const trimCode = this.module.code.trim(); // remove empty strings
        this.codeLength = trimCode.length;
    }

    async add() {
        if (this.module.name.trim() === '' || this.module.code.trim() === '' || this.module.lecturer.trim() === '') {
            this.assessService.presentAlert('Module', 'Fill in all module details.', ['OK']);
        } else {
            await this.assessService.modalCtrl.dismiss().then(() => {
                this.assessService.modules.push({
                    id: undefined,
                    name: this.module.name,
                    code: this.module.code.toUpperCase().trim(),
                    lecturer: this.module.lecturer
                });
                this.assessService.module = this.module.code.toUpperCase().trim();
                this.assessService.assignModuleID();
                this.assessService.storeModules();
            });
            this.disableButton = true;
        }
    }

    async cancel() {
        await this.assessService.modalCtrl.dismiss();
    }

}
