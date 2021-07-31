import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AssessmentService } from './assessment.service';
import { SettingsPage } from './settings.page';


@Component({
    template: `
        <ion-item button (click)="showSettings()" color="dark">
            <ion-label>Settings</ion-label>
        </ion-item>
        <!-- <ion-item button color="dark">
            <ion-label>About</ion-label>
        </ion-item> -->
    `
})

export class OptionsComponent {
    constructor(private popoverCtrl: PopoverController,
                private assessService: AssessmentService) {
    }

    async presentPopover(popoverComp: any, ev: any) {
        const popover = await this.popoverCtrl.create({
            component: popoverComp,
            event: ev,
            translucent: false,
            backdropDismiss: true,
        });
        await popover.present();
    }

    showSettings() {
        this.popoverCtrl.dismiss();
        this.assessService.presentModal(SettingsPage);
    }
}
