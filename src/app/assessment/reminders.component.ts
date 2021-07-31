import { Component } from '@angular/core';
import { AssessmentService } from './assessment.service';

@Component({
    template: `

  <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
            <ion-button (click)="returnSettings()">
                <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
            </ion-button>
        </ion-buttons>
        <ion-title class="font-app-title">Reminders</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="dark">
    </ion-content>
    `,
    styleUrls: ['./assessment.page.scss']
})

export class RemindersComponent {
    constructor(public assessService: AssessmentService) {
    }

    async returnSettings() {
      await this.assessService.modalCtrl.dismiss().then(() => {});
    }
}
