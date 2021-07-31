import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AssessmentService } from './assessment.service';

@Component({
    template: `
        <ion-item color="dark" lines="full">
            <ion-label class="filter-title">Filter by</ion-label>
            <ion-label class="filter-text">Modules</ion-label>
        </ion-item>
            <div class="ion-padding filter-background">
              <ion-chip *ngFor="let f of assessService.filters.filter" (click)="selectFilter(f.id)" [outline]="!f.isFilter" color="warning">
                  <ion-icon  color="warning" [name]="f.icon" size="small"></ion-icon>
                  <ion-label color="warning">{{f.title}}</ion-label>
              </ion-chip>
            </div>
    `,
    styleUrls: ['./assessment.page.scss']
})

export class FilterComponent {
    constructor(private popoverCtrl: PopoverController,
                public assessService: AssessmentService) {
    }

    selectFilter(id: number) {
      this.assessService.filters.filter[id].isFilter = !this.assessService.filters.filter[id].isFilter;
      const filterSelected = this.assessService.filters.filter[id].isFilter;
      this.assessService.newId = id;

      if (filterSelected) {
        this.addFilter(id);
      } else {
        this.removeFilter(id);
      }
    }

    addFilter(id: number) {
      this.assessService.clearAssessments();
      if (this.assessService.isFirstFilter) {
        this.assessService.isFirstFilter = false;
      } else {
          this.assessService.filters.filter[this.assessService.oldId].isFilter = false;
          this.assessService.filters.filter[this.assessService.oldId].icon = 'school-outline';
      }

      this.assessService.oldId = id;
      this.assessService.filters.filter[id].icon = 'school';
      this.assessService.filters.selectedFilter = this.assessService.filters.filter[id].title;
      this.assessService.iconFltr = {name: this.assessService.filters.selectedFilter,
        icon: 'funnel' , color: 'warning', isFilter: true};
      this.assessService.filter(true);
    }

    removeFilter(id: number) {
      this.assessService.clearAssessments();
      this.assessService.filter(false); //optimise
      this.assessService.filters.filter[id].isFilter = false;
      this.assessService.isFirstFilter = true;
      this.assessService.filters.selectedFilter = '';
      this.assessService.filters.filter[id].icon = 'school-outline';
      this.assessService.iconFltr = {name: '', icon: 'funnel-outline', color: 'light', isFilter: false};

      this.assessService.currentMonthAssessments.forEach((assessment) => {
        this.assessService.weekAssessments[assessment.week].assessment.push(assessment);
        this.assessService.weekAssessments[assessment.week].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
        this.assessService.assignWeekAssessmentsID(assessment.week);
      });

      this.assessService.nextMonthAssessments.forEach((assessment) => {
        this.assessService.weekAssessments[assessment.week].assessment.push(assessment);
        this.assessService.weekAssessments[assessment.week].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
        this.assessService.assignWeekAssessmentsID(assessment.week);
      });

      this.assessService.permMonthAssessments.forEach((month) => {
        const monthID = this.assessService.getMonthID(month.month, this.assessService.monthAssessments);
        month.assessment.forEach((assessment) => {
          this.assessService.monthAssessments[monthID].assessment.push(assessment);
          this.assessService.monthAssessments[monthID].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
        });
        this.assessService.assignMonthAssessmentID(month.month, this.assessService.monthAssessments);
      });
    }


    async presentPopover(popoverComp: any, ev: any) {
        const popover = await this.popoverCtrl.create(
            {
                component: popoverComp,
                cssClass: 'filter',
                translucent: false,
                backdropDismiss: true,
                showBackdrop: true,
                animated: false,
            },
        );
        await popover.present();
    }

}
