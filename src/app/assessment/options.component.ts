import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AssessmentService } from './assessment.service';
import { SettingsPage } from './settings.page';
import { ShowModuleComponent } from './show-module.component';
import { ShowTypeComponent } from './show-type.component';


@Component({
    template: `
        <ion-item button (click)="showModules()" color="dark">
            <ion-label>Modules</ion-label>
        </ion-item>
        <ion-item button (click)="showTypes()" color="dark">
            <ion-label>Types</ion-label>
        </ion-item>

        <!-- <ion-item button (click)="showSettings()" color="dark">
            <ion-label>Settings</ion-label>
        </ion-item>
        <ion-item color="dark">
            <ion-label color="medium">About</ion-label>
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

    showModules() {this.assessService.presentModal(ShowModuleComponent); }
    showTypes() {this.assessService.presentModal(ShowTypeComponent); }

    showSettings() {
        this.popoverCtrl.dismiss();
        this.assessService.presentModal(SettingsPage);
    }
}
