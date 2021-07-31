import { Component } from '@angular/core';
import { AssessmentService } from './assessment.service';
import { ShowModuleComponent } from './show-module.component';
import { ShowTypeComponent } from './show-type.component';
import { RemindersComponent } from './reminders.component';

@Component({
    template: `
        <ion-header>
            <ion-toolbar color="dark">
                <ion-buttons slot="start">
                    <ion-button (click)="returnHome()">
                        <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title class="font-app-title">Settings</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content color="dark">
            <ion-item color="dark" lines="none">
                <ion-label class="section-text" color="warning">General</ion-label>
            </ion-item>
            <ion-item (click)="showModules()" button color="dark">
                <ion-icon slot="start" name="library-outline"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <h2>Modules</h2>
                    <h6 class="label-description">View and edit your modules</h6>
                </ion-label>
            </ion-item>
            <ion-item (click)="showTypes()" button color="dark">
                <ion-icon slot="start" name="flask-outline"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <h2>Assessments</h2>
                    <h6 class="label-description">Set assessment types</h6>
                </ion-label>
            </ion-item>

            <ion-item color="dark" lines="none">
                <ion-label class="section-text" color="warning">Notifications</ion-label>
            </ion-item>
            <ion-item disabled (click)="showReminders()" button color="dark">
                <ion-icon slot="start" name="notifications-outline"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <h2>Reminders</h2>
                    <h6 class="label-description">Configure reminders for upcoming assessments</h6>
                </ion-label>
            </ion-item>

            <ion-item color="dark" lines="none">
                <ion-label class="section-text" color="warning">About</ion-label>
            </ion-item>
            <ion-item disabled button color="dark">
                <ion-icon slot="start" name="bug-outline"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <h2>Report Bug</h2>
                    <h6 class="label-description">Report any bugs or issues you've encountered</h6>
                </ion-label>
            </ion-item>
            <ion-item disabled button color="dark">
                <ion-icon slot="start" name="mail-outline"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <h2>Contact Me</h2>
                    <h6 class="label-description">Email your suggestions & tips for improvements</h6>
                </ion-label>
            </ion-item>
            <ion-item disabled button color="dark">
                <ion-icon slot="start" name="heart-outline"></ion-icon>
                <ion-label class="ion-text-wrap">
                    <h2>Rate & Review</h2>
                    <h6 class="label-description">If you love this app please leave a rate and review</h6>
                </ion-label>
            </ion-item>
        </ion-content>
    `,
    styleUrls: ['./settings.page.scss', './assessment.page.scss']
})

export class SettingsPage {

    constructor(private assessService: AssessmentService) {
    }

    showModules() {this.assessService.presentModal(ShowModuleComponent); }
    showTypes() {this.assessService.presentModal(ShowTypeComponent); }
    showReminders() {this.assessService.presentModal(RemindersComponent);}

    returnHome() {
        this.assessService.modalCtrl.dismiss();
    }

}
