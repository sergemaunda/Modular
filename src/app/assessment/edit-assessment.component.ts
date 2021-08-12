import { Component, OnInit, ViewChild } from '@angular/core';
import { AssessmentService } from './assessment.service';
import { IonTextarea } from '@ionic/angular';
import { noUndefined } from '@angular/compiler/src/util';

@Component({
    template: `
    <ion-content color="dark">
        <div class="center">
            <ion-grid>
                <ion-row>
                    <ion-col offset-lg="3" size-lg="6">
                        <ion-card color="dark">
                            <ion-item color="warning" lines="none" detail="false">
                                <ion-title>Assessment</ion-title>
                                <ion-button (click)="cancel()" fill="clear" color="light" slot="end">
                                    <h2><ion-icon name="close" slot="end"></ion-icon></h2>
                                </ion-button>
                            </ion-item>
                            <ion-card-content>
                                <ion-item lines="inset" detail="false" color="dark">
                                    <ion-label>Module</ion-label>
                                    <ion-input disabled="true" style="text-align: right" [(ngModel)]="assessment.module"></ion-input>
                                </ion-item>
                                <ion-item lines="inset" detail="false" color="dark">
                                    <ion-label>Type</ion-label>
                                    <ion-input  disabled="true" style="text-align: right" [(ngModel)]="assessment.type.name"></ion-input>
                                </ion-item>
                                <div class="date-container">
                                    <div style="flex-grow: 1">
                                        <ion-item lines="inset" detail="false" color="dark">
                                            <ion-label>Date</ion-label>
                                            <ion-datetime [(ngModel)]="assessment.rawDate" displayFormat="DD MMMM" pickerFormat="MMMM DD"
                                                placeholder="Select date" (ionChange)="hasDate(); assessmentChange()">
                                            </ion-datetime>
                                        </ion-item>
                                    </div>
                                    <ion-button *ngIf="btnClrDate" (click)="clearDate()" fill="clear" color="light" size="default">
                                        <ion-icon size="small" color="danger" name="close-circle-outline"></ion-icon>
                                    </ion-button>
                                </div>
                                <div class="date-container">
                                    <div style="flex-grow: 1">
                                        <ion-item lines="inset" detail="false" color="dark">
                                            <ion-label>Time</ion-label>
                                            <ion-datetime [(ngModel)]="assessment.rawTime" displayFormat="HH:mm" pickerFormat="HH:mm"
                                                placeholder="Select time" (ionChange)="hasTime(); assessmentChange()">
                                            </ion-datetime>
                                        </ion-item>
                                    </div>
                                    <ion-button *ngIf="btnClrTime" (click)="clearTime()" fill="clear" color="light" size="default">
                                        <ion-icon size="small" color="danger" name="close-circle-outline"></ion-icon>
                                    </ion-button>
                                </div>
                                <ion-item lines="inset" detail="false" color="dark">
                                    <ion-label>Title <ion-text *ngIf="titleRequired" color="danger">*</ion-text></ion-label>
                                    <ion-input style="text-align: right" size="10" type="text"
                                    placeholder="Enter title" [required]="titleRequired"  [(ngModel)]="assessment.title"
                                     (ionChange)="assessmentChange()"></ion-input>
                                </ion-item>
                                <ion-item lines="inset" detail="false" color="dark">
                                    <ion-label>Location</ion-label>
                                    <ion-input style="text-align: right" size="10" type="text"
                                    placeholder="Enter location" [(ngModel)]="assessment.location"
                                    (ionChange)="assessmentChange()"></ion-input>
                                </ion-item>
                                <ion-item color="dark" detail="false" lines="full">
                                    <ion-label position="floating">Description</ion-label>
                                    <ion-textarea [(ngModel)]="assessment.description" (ionChange)="assessmentChange()" #textAreaId>
                                    </ion-textarea>
                                </ion-item>
                            </ion-card-content>

                            <ion-card-content>
                                <ion-button [disabled]="disableButton" (click)="save()" color="warning" expand="block">Save</ion-button>
                            </ion-card-content>
                        </ion-card>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </div>

    </ion-content>
    `,


    // feature: -scope/breakdown
    //          -study plan

    styleUrls: ['./assessment.page.scss']
})

export class EditAssessmentComponent implements OnInit {

    @ViewChild('textAreaId', { static: false }) contentElement: IonTextarea;
    cmId = this.assessService.editCurrentMonthAssessmentId.assessmentId;
    nmId = this.assessService.editNextMonthAssessmentId.assessmentId;
    cmWId = this.assessService.editCurrentMonthAssessmentId.week;
    nmWId = this.assessService.editNextMonthAssessmentId.week;
    mId = this.assessService.editMonthAssessmentId.monthId;
    aId = this.assessService.editMonthAssessmentId.assessmentId;

    assessment: any;
    savedAssessment: any;
    savedId: number;
    savedWeekId: number;
    savedDate: any;
    savedMonth: string;
    savedTime: any;
    savedTitle: string;
    savedLocation: string;
    savedDescription: string;
    savedRawDate: string;
    savedRawTime: string;
    titleRequired: boolean;
    btnClrDate: boolean;
    btnClrTime: boolean;
    disableButton: boolean;

    constructor(public assessService: AssessmentService) {
    }

    ngOnInit() {
        if (!isNaN(this.cmId)) {
            this.assessment = this.assessService.currentMonthAssessments[this.cmId];
            this.assessService.editCurrentMonthAssessmentId = {week: NaN, assessmentId: NaN};
        }

        if (!isNaN(this.nmId)) {
          this.assessment = this.assessService.nextMonthAssessments[this.nmId];
          this.assessService.editNextMonthAssessmentId = {week: NaN, assessmentId: NaN};
        }

        if (!isNaN(this.mId) && !isNaN(this.aId)) {
            this.assessment = this.assessService.monthAssessments[this.mId].assessment[this.aId];
            this.assessService.editMonthAssessmentId = {monthId: NaN, assessmentId: NaN};
        }

        this.savedId = this.assessment.id;
        this.savedWeekId = this.assessment.weekId;
        this.savedDate = this.assessment.date;
        this.savedMonth = this.assessment.date.month;
        this.savedTime = this.assessment.time;
        this.savedTitle = this.assessment.title;
        this.savedLocation = this.assessment.location;
        this.savedDescription = this.assessment.description;
        this.savedRawDate = this.assessment.rawDate;
        this.savedRawTime = this.assessment.rawTime;
        this.titleRequired = false;
        this.btnClrDate = this.savedDate.hasDate;
        this.btnClrTime = this.savedTime.hasTime;
        this.disableButton = true;
    }

    setDate() {
      const DATE = new Date();
      this.savedDate.day = this.assessService.getDay(this.assessment.rawDate);
      this.savedDate.monthNo = this.assessService.getMonthNo(this.assessment.rawDate);
      this.savedDate.month = this.assessService.getMonth(this.assessment.rawDate).name;
      this.savedDate.monthColor = this.assessService.getMonth(this.assessment.rawDate).color;
      this.savedDate.monthHexColor = this.assessService.getMonth(this.assessment.rawDate).hexColor;
      this.savedDate.year = this.assessService.getYear(this.assessment.rawDate);
      DATE.setFullYear(parseInt(this.savedDate.year, 10), parseInt(this.savedDate.monthNo, 10) - 1, parseInt(this.savedDate.day, 10));
      this.savedDate.weekdayNo = DATE.getDay();
      this.savedDate.weekday = this.assessService.getWeekday(DATE.getDay());
    }

    setTime() {
      this.savedTime.minute = this.assessService.getMinute(this.assessment.rawTime);
      this.savedTime.hour = this.assessService.getHour(this.assessment.rawTime);
      this.savedTime.timezone = this.assessService.getTimezone(this.assessment.rawTime);
    }

    assessmentChange() {
        this.disableButton = this.savedRawDate.slice(0,10) === this.assessment.rawDate.slice(0,10) &&
                                this.savedRawTime.slice(11,16) === this.assessment.rawTime.slice(11,16) &&
                                this.savedTitle === this.assessment.title &&
                                this.savedLocation === this.assessment.location &&
                                this.savedDescription === this.assessment.description;
    }

    async save() {

        if (this.assessment.title.trim() === '') {
            this.titleRequired = true;
            this.assessService.presentAlert('Assessment', 'Fill in all assessment details.', ['OK']);
        } else {
            if ((this.assessment.rawDate === '') && (this.assessment.rawTime === '')) {
                const assessment = {
                    id: undefined,
                    week: undefined,
                    weekId: undefined,
                    module: this.assessment.module,
                    type: this.assessment.type,
                    title: this.assessment.title,
                    location: this.assessment.location.trim(),
                    description: this.assessment.description.trim(),
                    date: {hasDate: false, weekdayNo: undefined, weekday: undefined, day: undefined,
                            monthNo: undefined, month: undefined, monthColor: undefined, year: undefined},
                    time: {hasTime: false, minute: undefined, hour: undefined, timezone: undefined},
                    rawDate: '',
                    rawTime: '',
                    assessMonth: undefined,
                    dueDate: 0,
                    showDetails: {status: true, icon: 'chevron-up'}
                };

                await this.assessService.modalCtrl.dismiss().then(() => {
                    if (!isNaN(this.cmId)) {
                        this.assessService.deleteWeekAssessment(1, this.savedId, 'currentMonth', this.cmWId, this.savedWeekId);
                    } else {
                        this.assessService.deleteMonthAssesssment(this.savedId, this.savedMonth);
                    }

                    if (!isNaN(this.nmId)) {
                        this.assessService.deleteWeekAssessment(1, this.savedId, 'nextMonth', this.nmWId, this.savedWeekId);
                    } else {
                        this.assessService.deleteMonthAssesssment(this.savedId, this.savedMonth);
                    }

                  assessment.assessMonth = 'currentMonth';
                    this.assessService.currentMonthAssessments.push(assessment);
                    this.assessService.currentMonthAssessments.sort((a: any, b: any) => a.dueDate - b.dueDate);
                    this.assessService.assignCurrentMonthAssessmentsID();
                    this.assessService.storeCurrentMonthAssessments();
                    this.assessService.setWeekAssessments(assessment, 0);
                  });

            } else {
                let DUE_DATE: number;

                if (!(this.assessment.rawDate === '') && !(this.assessment.rawTime === '')) {
                    this.setDate();
                    this.setTime();
                    this.savedDate.hasDate = true;
                    this.savedTime.hasTime = true;
                    DUE_DATE = Date.UTC(parseInt(this.savedDate.year, 10), parseInt(this.savedDate.monthNo, 10) - 1,
                                                parseInt(this.savedDate.day, 10), parseInt(this.savedTime.hour, 10),
                                                 parseInt(this.savedTime.minute, 10)) + this.savedTime.timezone;
                }

                if (!(this.assessment.rawDate === '') && (this.assessment.rawTime === '')) {
                    this.setDate();
                    this.savedDate.hasDate = true;
                    this.savedTime.hasTime = false;
                    this.savedTime.minute = '';
                    this.savedTime.hour = '';
                    this.savedTime.timezone = 0;
                    DUE_DATE = Date.UTC(parseInt(this.savedDate.year, 10), parseInt(this.savedDate.monthNo, 10) - 1,
                                            parseInt(this.savedDate.day, 10)) + this.savedTime.timezone;
                }

                const DATE = DUE_DATE - Date.now();

                if (DATE >= 0) {
                    const DAY = 86340000;
                    const WEEK = 604740000;
                    const TODAY = new Date();
                    const TIME_GONE_IN_DAY = this.assessService.getMilliseconds(TODAY.getHours(), TODAY.getMinutes());
                    const TIME_GONE_IN_WEEK = (DAY * (TODAY.getDay())) + TIME_GONE_IN_DAY;
                    const currentMonth = this.assessService.getUTCMonth(TODAY.getMonth());

                    const assessment = {
                        id: undefined,
                        week: undefined,
                        weekId: undefined,
                        module: this.assessment.module,
                        type: this.assessment.type,
                        title: this.assessment.title,
                        location: this.assessment.location.trim(),
                        description: this.assessment.description.trim(),
                        date: this.savedDate,
                        time: this.savedTime,
                        rawDate: this.assessment.rawDate,
                        rawTime: this.assessment.rawTime,
                        assessMonth: undefined,
                        dueDate: DUE_DATE,
                        showDetails: {status: true, icon: 'chevron-up'}
                    };

                    if (currentMonth === this.savedDate.month) {
                        await this.assessService.modalCtrl.dismiss().then(() => {

                            if (!isNaN(this.mId) && !isNaN(this.aId)) {
                                this.assessService.deleteMonthAssesssment(this.savedId, this.savedMonth);
                            } else {
                                this.assessService.deleteWeekAssessment(1, this.savedId, 'currentMonth',this.cmWId, this.savedWeekId);
                            }

                            assessment.assessMonth = 'currentMonth';
                            this.assessService.currentMonthAssessments.push(assessment);
                            this.assessService.currentMonthAssessments.sort((a: any, b: any) => a.dueDate - b.dueDate);
                            this.assessService.assignCurrentMonthAssessmentsID();
                            this.assessService.storeCurrentMonthAssessments();
                            this.assessService.setWeekAssessments(assessment, DUE_DATE);
                            this.assessService.editCurrentMonthAssessmentId = {week: NaN, assessmentId: NaN};
                            this.assessService.editMonthAssessmentId = {monthId: NaN, assessmentId: NaN};
                        });
                        this.disableButton = true;
                    } else if ((DATE < ((2 * WEEK) - TIME_GONE_IN_WEEK)) && (assessment.date.month !== currentMonth)) {
                      await this.assessService.modalCtrl.dismiss().then(() => {

                        if (!isNaN(this.mId) && !isNaN(this.aId)) {
                            this.assessService.deleteMonthAssesssment(this.savedId, this.savedMonth);
                        } else {
                            this.assessService.deleteWeekAssessment(1, this.savedId, 'nextMonth',this.nmWId, this.savedWeekId);
                        }

                        assessment.assessMonth = 'nextMonth';
                        this.assessService.nextMonthAssessments.push(assessment);
                        this.assessService.nextMonthAssessments.sort((a: any, b: any) => a.dueDate - b.dueDate);
                        this.assessService.assignNextMonthAssessmentsID();
                        this.assessService.storeNextMonthAssessments();
                        this.assessService.setWeekAssessments(assessment, DUE_DATE);
                        this.assessService.editNextMonthAssessmentId = {week: NaN, assessmentId: NaN};
                        this.assessService.editMonthAssessmentId = {monthId: NaN, assessmentId: NaN};
                    });
                    this.disableButton = true;
                    } else {
                        await this.assessService.modalCtrl.dismiss().then(() => {
                            if (!isNaN(this.cmId)) {
                                this.assessService.deleteWeekAssessment(1, this.savedId, 'currentMonth',this.cmWId, this.savedWeekId);
                            } else {
                                this.assessService.deleteMonthAssesssment(this.savedId, this.savedMonth);
                            }

                            if (!isNaN(this.nmId)) {
                              this.assessService.deleteWeekAssessment(1, this.savedId, 'nextMonth',this.nmWId, this.savedWeekId);
                            } else {
                                this.assessService.deleteMonthAssesssment(this.savedId, this.savedMonth);
                            }

                            const month = this.savedDate.month;
                            const tempMonthID = this.assessService.getMonthID(month, this.assessService.monthAssessments);
                            const permMonthID = this.assessService.getMonthID(month, this.assessService.permMonthAssessments);

                            assessment.assessMonth = undefined;
                            this.assessService.monthAssessments[tempMonthID].assessment.push(assessment);
                            this.assessService.permMonthAssessments[permMonthID].assessment.push(assessment);

                            this.assessService.monthAssessments[tempMonthID].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
                            this.assessService.permMonthAssessments[permMonthID].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);

                            this.assessService.assignMonthAssessmentID(month, this.assessService.monthAssessments);
                            this.assessService.assignMonthAssessmentID(month, this.assessService.permMonthAssessments);
                            this.assessService.storeMonthAssessments();
                            this.assessService.editCurrentMonthAssessmentId = {week: NaN, assessmentId: NaN};
                            this.assessService.editMonthAssessmentId = {monthId: NaN, assessmentId: NaN};
                        });
                        this.disableButton = true;
                    }
                } else {
                    this.assessService.presentAlert('Assessment', 'Select appropriate date and time.', ['OK']);
                }
            }
        }
    }

    hasDate() {if (this.assessment.rawDate !== '') {this.btnClrDate = true; }}
    hasTime() {if (this.assessment.rawTime !== '') {this.btnClrTime = true; }}

    clearDate() {
        this.assessment.rawDate = '';
        this.btnClrDate = false;
    }

    clearTime() {
        this.assessment.rawTime = '';
        this.btnClrTime = false;
    }

    async cancel() {
        this.assessment.rawDate = this.savedRawDate;
        this.assessment.rawTime = this.savedRawTime;
        this.assessment.title = this.savedTitle;
        this.assessment.location = this.savedLocation;
        this.assessment.description = this.savedDescription;
        await this.assessService.modalCtrl.dismiss();
    }
}
