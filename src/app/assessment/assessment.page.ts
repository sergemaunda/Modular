import { Component, OnInit } from '@angular/core';
import { AssessmentService } from './assessment.service';
import { AddAssessmentComponent } from '../assessment/add-assessment.component';
import { EditAssessmentComponent } from '../assessment/edit-assessment.component';
import { OptionsComponent } from '../assessment/options.component';
import { FilterComponent } from './filter.component';
import { SettingsPage } from './settings.page';

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

  showBtn: boolean;
  oldTop: number;

  constructor(
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

  editCurrentMonthAssessment(week: number, assessId: number, assessmentMonth: string) {
    if (assessmentMonth === 'currentMonth') {
      this.assessService.editCurrentMonthAssessmentId.week = week;
      this.assessService.editCurrentMonthAssessmentId.assessmentId = assessId;
    }

    if (assessmentMonth === 'nextMonth') {
      this.assessService.editNextMonthAssessmentId.week = week;
      this.assessService.editNextMonthAssessmentId.assessmentId = assessId;
    }
    this.assessService.presentModal(EditAssessmentComponent);
  }

  editMonthAssessment(monthId: number, assessId: number) {
    this.assessService.editMonthAssessmentId.monthId = monthId;
    this.assessService.editMonthAssessmentId.assessmentId = assessId;
    this.assessService.presentModal(EditAssessmentComponent);
  }

  showSettings() {
    this.assessService.presentModal(SettingsPage);
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

  deleteWeekAssessment(id: number, weekId: number, week: number, assessmentMonth) {
    const assessment = this.assessService.weekAssessments[week].assessment[weekId];
    this.assessService.deleteWeekAssessment(1, id, assessmentMonth,week, weekId);
    this.assessService.presentUndoDeleteWeekAssessment(assessment, week, assessmentMonth);
  }

  deleteMonthAssessment(id: number, month: string) {
    const tempMonthID = this.assessService.getMonthID(month, this.assessService.monthAssessments);
    const tempAssessment = this.assessService.monthAssessments[tempMonthID].assessment[id];
    this.assessService.deleteMonthAssesssment(id, month);
    this.assessService.presentUndoDeleteMonthAssessment(tempAssessment, month);
  }
}
