import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { AssessmentService } from './assessment.service';
import { AddAssessmentComponent } from '../assessment/add-assessment.component';
import { EditAssessmentComponent } from '../assessment/edit-assessment.component';
import { OptionsComponent } from '../assessment/options.component';
import { FilterComponent } from './filter.component';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.page.html',
  styleUrls: ['./assessment.page.scss'],
})

export class AssessmentPage implements OnInit {
  weekAssessments = [];
  toBeConfirmed = [];
  thisWeek = [];
  nextWeek = [];
  upComingWeeks = [];
  pWA = {weekType: undefined, weekId: undefined, assessId: undefined, monthType: undefined}; //properties of selected week assessment
  pMA = {assessId: undefined, monthId: undefined, month: undefined}; //properties of selected month assessment

  showBtn: boolean;
  oldTop: number;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private optionsComp: OptionsComponent,
    private filterComp: FilterComponent,
    public assessService: AssessmentService) {
  }

  ngOnInit() {
    this.assessService.assessOnInit();
    this.assessService.typesOnInit();
    this.assessService.modulesOnInit();

    this.weekAssessments = this.assessService.weekAssessments;
    this.toBeConfirmed = this.weekAssessments[0].assessment;
    this.thisWeek = this.weekAssessments[1].assessment;
    this.nextWeek = this.weekAssessments[2].assessment;
    this.upComingWeeks = this.weekAssessments[3].assessment;

    this.showBtn = true;
    this.oldTop = 0;
  }

  scrollDown(ev: any) {
    const newTop = ev.detail.scrollTop;

    if (newTop >= this.oldTop) {
      this.oldTop = newTop;
      this.showBtn = false;
    } else {
      this.oldTop = newTop;
      this.showBtn = true;
    }
  }

  addAssessment() {
    this.assessService.presentModal(AddAssessmentComponent);
  }

  editCurrentMonthAssessment(weekType: number, assessId: number, monthType: string) {
    if (monthType === 'currentMonth') {
      this.assessService.editCurrentMonthAssessmentId.week = weekType;
      this.assessService.editCurrentMonthAssessmentId.assessmentId = assessId;
    }

    if (monthType === 'TBC') {
      this.assessService.editTBCAssessmentId.week = weekType;
      this.assessService.editTBCAssessmentId.assessmentId = assessId;
    }
    this.assessService.presentModal(EditAssessmentComponent);
  }

  editMonthAssessment(assessId: number, monthId: number) {
    this.assessService.editMonthAssessmentId.monthId = monthId;
    this.assessService.editMonthAssessmentId.assessmentId = assessId;
    this.assessService.presentModal(EditAssessmentComponent);
  }

  showOptions(ev: any) {
    this.optionsComp.presentPopover(OptionsComponent, ev);
  }

  showFilters(ev: any) {
    this.filterComp.presentPopover(FilterComponent, ev);
  }

  showWeekAssessmentDetails(weekId: number, id: number, event: string) {
    const assessment = this.weekAssessments[weekId].assessment[id];
    if (event === 'click') {
      assessment.showDetails.status = !assessment.showDetails.status;
      if (assessment.showDetails.status === true) {
        assessment.showDetails.icon = 'chevron-up';
      } else {
        assessment.showDetails.icon = 'chevron-down';
      }
    }
    if (event === 'drag') {assessment.showDetails.status = false; assessment.showDetails.icon = 'chevron-down'; }
  }

  showMonthAssessmentDetails(monthId: number, id: number, event: string) {
    const assessment = this.assessService.monthAssessments[monthId].assessment[id];
    if (event === 'click') {
      assessment.showDetails.status = !assessment.showDetails.status;
      if (assessment.showDetails.status === true) {
        assessment.showDetails.icon = 'chevron-up';
      } else {
        assessment.showDetails.icon = 'chevron-down';
      }
    }
    if (event === 'drag') {assessment.showDetails.status = false; assessment.showDetails.icon = 'chevron-down'; }
  }

  deleteWeekAssessment(weekType: number, weekId: number, assessId: number, monthType: string) {
    const assessment = this.assessService.weekAssessments[weekType].assessment[weekId];
    this.assessService.deleteWeekAssessment(1, assessId, monthType, weekType, weekId);
    this.assessService.presentUndoDeleteWeekAssessment(assessment, weekType, monthType);
  }

  deleteMonthAssessment(assessId: number, month: string) {
    const tempMonthID = this.assessService.getMonthID(month, this.assessService.monthAssessments);
    const tempAssessment = this.assessService.monthAssessments[tempMonthID].assessment[assessId];
    this.assessService.deleteMonthAssesssment(assessId, month);
    this.assessService.presentUndoDeleteMonthAssessment(tempAssessment, month);
  }
  setWeekAssessmentProp(weekType: number, weekId: number, assessId: number, monthType: string) {
    this.pWA.weekType = weekType;
    this.pWA.weekId = weekId;
    this.pWA.assessId = assessId;
    this.pWA.monthType = monthType;
  }

  setMonthAssessmentProp(assessId: number, monthId: number, month: string) {
    this.pMA.assessId = assessId;
    this.pMA.monthId = monthId;
    this.pMA.month = month;
  }

  async presentActionSheet(dateType: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Options',
      cssClass: 'action-sheet-background',
      buttons: [
        {
          text: 'Edit',
          role: 'destructive',
          icon: 'pencil',
          cssClass: 'options-btn',
          handler: () => {
            console.log('Edit clicked');
            switch (dateType) {
              case 'week':
                this.editCurrentMonthAssessment(this.pWA.weekType, this.pWA.assessId, this.pWA.monthType);
              break;
              case 'month':
                this.editMonthAssessment(this.pMA.assessId, this.pMA.monthId);
              break;
            }
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          cssClass: 'options-btn',
          handler: () => {
            console.log('Delete clicked');
            switch (dateType) {
              case 'week':
                this.deleteWeekAssessment(this.pWA.weekType, this.pWA.weekId, this.pWA.assessId, this.pWA.monthType);
              break;
              case 'month':
                this.deleteMonthAssessment(this.pMA.assessId, this.pMA.month);
              break;
            }
          }
        },
        {
          text: 'Cancel',
          role: 'destructive',
          icon: 'close',
          cssClass: 'options-btn',
        }
      ]
    });
    await actionSheet.present();
  }
}
