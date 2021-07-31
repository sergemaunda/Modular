import { Component } from '@angular/core';
import { AddModuleComponent } from '../assessment/add-module.component';
import { EditModuleComponent } from '../assessment/edit-module.component';
import { FilterComponent } from '../assessment/filter.component';
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
        <ion-title class="font-app-title">Modules</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addModule()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content color="dark">
        <ion-item (click)="editModule(module.id)" button color="dark" detail="false" *ngFor="let module of this.assessService.modules">
          <ion-icon name="library-outline" color="light" slot="start"></ion-icon>
          <ion-icon (click)="onDeleteModule(module.id)" slot="end" name="trash-outline" color="danger"></ion-icon>
          <ion-label class="ion-text-wrap">
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
                private filter: FilterComponent) {
    }

    addModule() {
      this.assessService.presentModal(AddModuleComponent);
    }

    editModule(id: number) {
      this.assessService.editModuleId = id;
      this.assessService.presentModal(EditModuleComponent);
    }

    onDeleteModule(id: any) {
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
