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
                <ion-input [(ngModel)]="module.name" type="text" (ionChange)="moduleChange()"></ion-input>
            </ion-item>
            <ion-item lines="inset" color="dark">
                <ion-label position="floating">Code</ion-label>
                <ion-input [(ngModel)]="module.code" (ionChange)="onInput(); moduleChange()"  type="text" maxlength="15"
                style="text-transform:uppercase">
                </ion-input>
            </ion-item>
            <p style="color:grey;font-size: 9px; text-align: right">{{ codeLength }}/15</p>
        </ion-card-content>
        <ion-card-content>
            <ion-item lines="inset" color="dark">
                <ion-icon name="person-outline" slot="start" size="large"></ion-icon>
                <ion-label position="floating">Lecturer</ion-label>
                <ion-input [(ngModel)]="module.lecturer" type="text" (ionChange)="moduleChange()"></ion-input>
            </ion-item>
        </ion-card-content>
        <ion-card-content>
            <ion-button [disabled]="disableButton" (click)="save()" color="warning" expand="block">Save</ion-button>
        </ion-card-content>
    </ion-content>
    `,

    styleUrls: ['./assessment.page.scss']
})

export class EditModuleComponent implements OnInit {
    index = this.assessService.editModuleId;
    module = this.assessService.modules[this.index];

    savedName: string;
    savedCode: string;
    savedLecturer: string;
    codeLength: number;
    disableButton: boolean;

    constructor(private assessService: AssessmentService) {
    }

    ngOnInit() {
        this.savedName = this.module.name;
        this.savedCode = this.module.code;
        this.savedLecturer = this.module.lecturer;
        this.codeLength = this.savedCode.length;
        this.disableButton = true;
    }

    onInput() {
        const trimCode = this.module.code.trim();
        this.codeLength = trimCode.length;
    }

    moduleChange() {
        this.disableButton = this.savedName.trim() === this.module.name.trim() &&
                            this.savedCode.trim() === this.module.code.trim() &&
                            this.savedLecturer.trim() === this.module.lecturer.trim();
    }

    async save() {
        if (this.module.name.trim() === '' || this.module.code.trim() === '' || this.module.lecturer.trim() === '') {
            this.assessService.presentAlert('Module', 'Fill in all module details.', ['OK']);
        } else {
            await this.assessService.modalCtrl.dismiss().then(() => {
                this.assessService.modules[this.index].name = this.module.name;
                this.assessService.modules[this.index].code = this.module.code.toUpperCase().trim();
                this.assessService.modules[this.index].lecturer = this.module.lecturer;

                this.assessService.storeModules();
                this.assessService.presentToast('Edit saved!');
            });
            this.disableButton = true;
        }
    }

    async cancel() {
        this.module.name = this.savedName;
        this.module.code = this.savedCode;
        this.module.lecturer = this.savedLecturer;
        await this.assessService.modalCtrl.dismiss();
    }
}
