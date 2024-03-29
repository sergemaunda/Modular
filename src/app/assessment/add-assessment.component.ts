import { Component, OnInit, ViewChild } from '@angular/core';
import { AddModuleComponent } from '../assessment/add-module.component';
import { AddTypeComponent } from '../assessment/add-type.component';
import { FilterComponent } from '../assessment/filter.component';
import { AssessmentService } from './assessment.service';
import { IonTextarea } from '@ionic/angular';

@Component({
    template: `
    <ion-content color="dark">
    <ion-item color="warning" lines="none" detail="false">
        <ion-title>Assessment</ion-title>
        <ion-button (click)="cancel()" fill="clear" color="light" slot="end">
            <h2><ion-icon name="close" slot="end"></ion-icon></h2>
        </ion-button>
    </ion-item>
    <ion-card-content>
        <ion-item class="item-select" lines="inset" detail="false" color="dark">
            <ion-label>Module <ion-text *ngIf="moduleRequired" color="danger">*</ion-text></ion-label>
            <ion-select [(ngModel)]="this.assessService.module" [interfaceOptions]="moduleSelectOptions"
            interface="alert">
                <ion-select-option *ngFor="let module of this.assessService.modules" [value]="module.code">
                    {{ module.code }}
                </ion-select-option>
            </ion-select>
            <ion-button (click)="addModule()" fill="clear" color="light" size="default">
                <ion-icon class="icon-size" color="warning" name="add-circle-outline"></ion-icon>
            </ion-button>
        </ion-item>
        <ion-item lines="inset" detail="false" color="dark">
            <ion-label>Type <ion-text *ngIf="typeRequired" color="danger">*</ion-text></ion-label>
            <ion-select [(ngModel)]="this.assessService.type"
            [interfaceOptions]="typeSelectOptions" interface="alert">
                <ion-select-option *ngFor="let type of this.assessService.defaultTypes" [value]="type">
                    {{type.name}}
                </ion-select-option>
                <ion-select-option *ngFor="let type of this.assessService.types" [value]="type">
                    {{type.name}}
                </ion-select-option>
            </ion-select>
            <ion-button (click)="addType()" fill="clear" color="light" size="default">
                <ion-icon class="icon-size" color="warning" name="add-circle-outline"></ion-icon>
            </ion-button>
        </ion-item>
        <div class="date-container">
            <div style="flex-grow: 1">
                <ion-item lines="inset" detail="false" color="dark">
                    <ion-label>Date</ion-label>
                    <ion-datetime [(ngModel)]="date.dateString" displayFormat="DD MMMM" pickerFormat="MMMM DD"
                        placeholder="Select date" (ionChange)="hasDate()">
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
                    <ion-datetime [(ngModel)]="time.timeString" displayFormat="HH:mm" pickerFormat="HH:mm"
                        placeholder="Select time" (ionChange)="hasTime()">
                    </ion-datetime>
                </ion-item>
            </div>
            <ion-button *ngIf="btnClrTime" (click)="clearTime()" fill="clear" color="light" size="default">
                <ion-icon size="small" color="danger" name="close-circle-outline"></ion-icon>
            </ion-button>
        </div>
        <ion-item lines="inset" detail="false" color="dark">
            <ion-label>Title <ion-text *ngIf="titleRequired" color="danger">*</ion-text></ion-label>
            <ion-input style="text-align: right" type="text" size="10"
            placeholder="Enter title" [required]="titleRequired" [(ngModel)]="title"></ion-input>
        </ion-item>
        <ion-item lines="inset" detail="false" color="dark">
            <ion-label>Location</ion-label>
            <ion-input style="text-align: right" size="10" type="text"
            placeholder="Enter location" [(ngModel)]="location"></ion-input>
        </ion-item>
        <ion-item color="dark" detail="false" lines="full">
          <ion-label position="floating">Description</ion-label>
          <ion-textarea rows="4"
              #textAreaId [(ngModel)]="description">
          </ion-textarea>
        </ion-item>
    </ion-card-content>

    <ion-card-content>
        <ion-button [disabled]="disableButton" (click)="add()" color="warning" expand="block">Add</ion-button>
    </ion-card-content>
  </ion-content>
    `,

    styleUrls: ['./assessment.page.scss']
})

export class AddAssessmentComponent implements OnInit {

    @ViewChild('textAreaId', { static: false }) contentElement: IonTextarea;

    date = {dateString: '', weekdayNo: -1, weekday: '', day: '', monthNo: '', month: '', monthColor: '', monthHexColor: '', year: ''};
    time = {timeString: '', hour: '', minute: '', timezone: 0};
    location: string;
    title: string;
    description: string;
    moduleRequired: boolean;
    typeRequired: boolean;
    titleRequired: boolean;
    btnClrDate: boolean;
    btnClrTime: boolean;
    disableButton: boolean;

    moduleSelectOptions = {
        header: 'Module'
    };

    typeSelectOptions = {
        header: 'Type'
    };

    constructor(public assessService: AssessmentService,
                private filter: FilterComponent) {
    }

    ngOnInit() {
        this.assessService.module = undefined;
        this.assessService.type = undefined;
        this.title = '';
        this.description = '';
        this.location = '';
        this.moduleRequired = false;
        this.typeRequired = false;
        this.titleRequired = false;
        this.btnClrDate = false;
        this.btnClrTime = false;
        this.disableButton = false;
    }

    addCrclBullet() {
        const CRCL_BULLET = '  • ';

        if (this.description === '') {
            this.description = CRCL_BULLET;
        } else {
            this.description += '\n' + CRCL_BULLET;
        }

        this.contentElement.setFocus();
    }

    // addSqrBullet() {
    //     const SQR_BULLET = '    ▪ ';
    //     this.description += '\n' + SQR_BULLET;
    //     console.log('double click');
    // }

    addModule() {
        this.assessService.presentModal(AddModuleComponent);
    }

    addType() {
        this.assessService.presentModal(AddTypeComponent);
    }

    setDate() {
            const DATE = new Date();
            this.date.day = this.assessService.getDay(this.date.dateString);
            this.date.monthNo = this.assessService.getMonthNo(this.date.dateString);
            this.date.month = this.assessService.getMonth(this.date.dateString).name;
            this.date.monthColor = this.assessService.getMonth(this.date.dateString).color;
            this.date.monthHexColor = this.assessService.getMonth(this.date.dateString).hexColor;
            this.date.year = this.assessService.getYear(this.date.dateString);
            this.time.timezone = this.assessService.getTimezone(this.date.dateString);
            DATE.setFullYear(parseInt(this.date.year, 10), parseInt(this.date.monthNo, 10) - 1, parseInt(this.date.day, 10));

            this.date.weekdayNo = DATE.getDay();
            this.date.weekday = this.assessService.getWeekday(DATE.getDay());
    }

    setTime() {
            this.time.minute = this.assessService.getMinute(this.time.timeString);
            this.time.hour = this.assessService.getHour(this.time.timeString);
    }

    setNotifications(assessment: any): any{
      const day = 86400000;
      const minute = 60000;
      const hour = 3600000;
      const today = new Date();
      const timeNow = today.getTime();
      const timeMilliseconds = this.assessService.getMilliseconds(parseInt(assessment.time.hour, 10), parseInt(assessment.time.minute, 10));
      const time = assessment.time.hasTime ? timeMilliseconds:(day - 1);
      const date = (assessment.dueDate - time); // notifications will appear at 00h00
      const noOfNotifications = assessment.time.hasTime ? 6:5;
      const notifications = [];

      const body = [assessment.title + ' due next week! Start preparing.',
      assessment.title + ' due soon! Open up those books and study.',
      assessment.title + ' due in a few days! Study! Study! Study!',
      assessment.title + ' due tomorrow! Hope you ready.',
      assessment.title + ' due today! Goodluck, you got this.',
      assessment.title + ' due in 1 hour!'];

      const schedule = [timeNow > (date - (day*7)) && timeNow < (date - (day*5)) ? timeNow + minute : (date - (day*7)),
                        timeNow > (date - (day*5)) && timeNow < (date - (day*3)) ? timeNow + minute : (date - (day*5)),
                        timeNow > (date - (day*3)) && timeNow < (date - (day*1)) ? timeNow + minute : (date - (day*3)),
                        timeNow > (date - (day*1)) && timeNow < (date - (day*0)) ? timeNow + minute : (date - (day*1)),
                        timeNow > (date - (day*0)) && timeNow < (assessment.dueDate - (day*0 + hour)) ? timeNow + minute : (date - (day*0)),
                        assessment.dueDate - (day*0 + hour) // 1 hour before assessment
      ];

      for (let i = 0; i < noOfNotifications; ++i) {
        const notification = {
          id: undefined,
          title: assessment.module + ' - ' + assessment.type.name,
          body: body[i],
          schedule: {at: new Date(schedule[i])},
          iconColor: '#ffc409',
          smallIcon: 'icon'
        };
        notifications.push(notification);
      };

      return notifications;
    }

    async add() {
        if (this.assessService.module === undefined || this.assessService.type === undefined || this.title.trim() === '') {
            if (this.assessService.module === undefined) {this.moduleRequired = true; }
            if (this.assessService.type === undefined) {this.typeRequired = true; }
            if (this.title.trim() === '') {this.titleRequired = true; }

            this.assessService.presentAlert('Assessment', 'Fill in all assessment details.', ['OK']);
        } else {
            if ((this.date.dateString === '') && (this.time.timeString === '')) {
                const assessment = {
                    id: undefined,
                    week: undefined,
                    weekId: undefined,
                    module: this.assessService.module,
                    type: this.assessService.type,
                    title: this.title,
                    location: this.location.trim(),
                    description: this.description.trim(),
                    date: {hasDate: false, weekdayNo: undefined, weekday: undefined, day: undefined,
                            monthNo: undefined, month: undefined, monthColor: undefined, monthHexColor: undefined, year: undefined},
                    time: {hasTime: false, minute: undefined, hour: undefined, timezone: undefined},
                    rawDate: '',
                    rawTime: '',
                    assessMonth: undefined,
                    dueDate: 0,
                    showDetails: {status: true, icon: 'chevron-up'},
                    notifications: undefined
                };

                await this.assessService.modalCtrl.dismiss().then(() => {
                    this.clearFilter(assessment.module);
                    assessment.assessMonth = 'TBC';
                    this.assessService.tbcAssessments.push(assessment);
                    this.assessService.tbcAssessments.sort((a: any, b: any) => a.dueDate - b.dueDate);
                    this.assessService.assigntbcAssessmentsID();
                    this.assessService.storetbcAssessments();
                    this.assessService.setWeekAssessments(assessment, 0);
                    this.clearAssessment();
                });

            } else {
                let hasTime = false;
                let hasDate = false;
                let DUE_DATE: number;

                if (!(this.date.dateString === '') && !(this.time.timeString === '')) {
                    this.setDate();
                    this.setTime();
                    hasDate = true;
                    hasTime = true;
                    DUE_DATE = Date.UTC(parseInt(this.date.year, 10), parseInt(this.date.monthNo, 10) - 1, parseInt(this.date.day, 10),
                                            parseInt(this.time.hour, 10), parseInt(this.time.minute, 10)) + this.time.timezone;
                }

                if (!(this.date.dateString === '') && (this.time.timeString === '')) {
                    const DAY = 86399999;
                    this.setDate();
                    hasDate = true;
                    DUE_DATE = Date.UTC(parseInt(this.date.year, 10), parseInt(this.date.monthNo, 10) - 1, parseInt(this.date.day, 10))
                    + DAY + this.time.timezone;
                }

                const DATE = DUE_DATE - Date.now();

                if (DATE >= 0) {
                    const DAY = 86399999;
                    const WEEK = 604799999;
                    const TODAY = new Date();
                    const TIME_GONE_IN_DAY = this.assessService.getMilliseconds(TODAY.getHours(), TODAY.getMinutes());
                    const TIME_GONE_IN_WEEK = (DAY * (TODAY.getDay())) + TIME_GONE_IN_DAY;
                    const currentMonth = this.assessService.getUTCMonth(TODAY.getMonth()).month;

                    const assessment = {
                        id: undefined,
                        week: undefined,
                        weekId: undefined,
                        module: this.assessService.module,
                        type: this.assessService.type,
                        title: this.title,
                        location: this.location.trim(),
                        description: this.description.trim(),
                        date: {hasDate, weekdayNo: this.date.weekdayNo, weekday: this.date.weekday, day: this.date.day,
                            monthNo: this.date.monthNo, month: this.date.month, monthColor: this.date.monthColor,
                            monthHexColor: this.date.monthHexColor, year: this.date.year},
                        time: {hasTime, minute: this.time.minute, hour: this.time.hour, timezone: this.time.timezone},
                        rawDate: this.date.dateString,
                        rawTime: this.time.timeString,
                        assessMonth: undefined,
                        dueDate: DUE_DATE,
                        showDetails: {status: true, icon: 'chevron-up'},
                        notifications: undefined
                    };

                    const isCurrentMonth = currentMonth === assessment.date.month;
                    const isNextMonth = (DATE < ((2 * WEEK) - TIME_GONE_IN_WEEK)) && (assessment.date.month !== currentMonth);

                    if (isCurrentMonth || isNextMonth) {
                      await this.assessService.modalCtrl.dismiss().then(() => {
                        this.clearFilter(assessment.module);
                        assessment.assessMonth = 'currentMonth';
                        assessment.notifications = this.setNotifications(assessment);
                        this.assessService.currentMonthAssessments.push(assessment);
                        this.assessService.currentMonthAssessments.sort((a: any, b: any) => a.dueDate - b.dueDate);
                        this.assessService.assignCurrentMonthAssessmentsID();
                        this.assessService.storeCurrentMonthAssessments();
                        this.assessService.setWeekAssessments(assessment, DUE_DATE);
                        this.assessService.configLocalNotifications();
                        this.assessService.setLocalNotifications(this.assessService.notifications);
                        this.clearAssessment();
                      });
                      this.disableButton = true;

                    } else {
                        const month = this.date.month;
                        const tempMonthID = this.assessService.getMonthID(month, this.assessService.monthAssessments);
                        const permMonthID = this.assessService.getMonthID(month, this.assessService.permMonthAssessments);

                        await this.assessService.modalCtrl.dismiss().then(() => {
                          this.clearFilter(assessment.module);
                          this.assessService.monthAssessments[tempMonthID].assessment.push(assessment);
                          this.assessService.permMonthAssessments[permMonthID].assessment.push(assessment);

                          this.assessService.monthAssessments[tempMonthID].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
                          this.assessService.permMonthAssessments[permMonthID].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);

                          this.assessService.assignMonthAssessmentID(month, this.assessService.monthAssessments);
                          this.assessService.assignMonthAssessmentID(month, this.assessService.permMonthAssessments);
                          this.assessService.storeMonthAssessments();
                          console.log(this.assessService.monthAssessments);
                          console.log(this.assessService.permMonthAssessments);
                          this.clearAssessment();
                        });
                        this.disableButton = true;
                    }
                } else {
                    this.assessService.presentAlert('Assessment', 'Select appropriate date and time.', ['OK']);
                }
            }
        }
    }

    hasDate() {if (this.date.dateString !== '') {this.btnClrDate = true; }}
    hasTime() {if (this.time.timeString !== '') {this.btnClrTime = true; }}

    clearFilter(assessment: string) {
      if ( (this.assessService.filters.selectedFilter !== '') && (assessment !== this.assessService.filters.selectedFilter)) {
        this.filter.removeFilter(this.assessService.newId);
      }
    }

    clearDate() {
        this.date.dateString = '';
        this.btnClrDate = false;
    }

    clearTime() {
        this.time.timeString = '';
        this.btnClrTime = false;
    }

    clearAssessment() {
        this.assessService.module = undefined;
        this.assessService.type = undefined;
    }

    async cancel() {
        await this.assessService.modalCtrl.dismiss();
    }
}
