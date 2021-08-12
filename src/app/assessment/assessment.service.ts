import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})

export class AssessmentService {
  module: string;
  type: any;
  editModuleId: number;
  editTypeId: number;
  editCurrentMonthAssessmentId = {week: NaN, assessmentId: NaN};
  editNextMonthAssessmentId = {week: NaN, assessmentId: NaN};
  editMonthAssessmentId = {monthId: NaN, assessmentId: NaN};
  iconFltr = {name: '', icon: 'funnel-outline', color: 'light', isFilter: false};

  //"isFirstFilter" is used to determine if the filter selected is the first filter
  //so as to not remove any non-existent "previous filter"
  isFirstFilter = true;
  oldId = -1;
  newId = -1;
  filters = {selectedFilter: '', filter: []};
  currentMonthAssessments = [];
  nextMonthAssessments = [];
  monthAssessments = [];
  permMonthAssessments = [];
  notifications = [];
  modules = [];
  types = [];
  notifs = {func: console.log('Les Gooo!')};
  weekAssessments = [
    {
      id: 0,
      period: 'To be confirmed',
      assessment: []
    },
    {
      id: 1,
      period: 'This week',
      assessment: []
    },
    {
      id: 2,
      period: 'Next week',
      assessment: []
    },
    {
      id: 3,
      period: 'Upcoming weeks',
      assessment: []
    },
  ];
  defaultTypes = [
    {
      id: 0,
      name: 'Test'
    },
    {
      id: 1,
      name: 'Exam',
    },
    {
      id: 2,
      name: 'Assignment'
    },
    {
      id: 3,
      name: 'Report',
    }
  ];

  constructor(private storage: Storage,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private popoverCtrl: PopoverController,
              public  modalCtrl: ModalController,
              ) {
  }
// localnotifs -  60, today - 03h00, tommorow - 09h00, week, month

  setLocalNotifications(notifications: any) {
    LocalNotifications.schedule({notifications});
  }

  async assessOnInit() {
    await this.storage.create();
    // this.setLocalNotifications();
    const today = new Date();
    const currentMonth = this.getUTCMonth(today.getMonth());

    let keys = [];
    await this.storage.keys()
    .then((data) => {keys = data; });

    if (keys[keys.indexOf('month_assessments')] === 'month_assessments') {
      await this.storage.get('month_assessments')
    .then(
      (data) => {this.permMonthAssessments = data; }
    ); }

    if (keys[keys.indexOf('currentMonth_assessments')] === 'currentMonth_assessments') {
      await this.storage.get('currentMonth_assessments')
      .then(
        (data) => {this.currentMonthAssessments = data; }
      );
    }

    if (keys[keys.indexOf('nextMonth_assessments')] === 'nextMonth_assessments') {
      await this.storage.get('nextMonth_assessments')
      .then(
        (data) => {this.nextMonthAssessments = data; }
      );
    }

    if ((this.permMonthAssessments !== null) && (this.permMonthAssessments[0] !== undefined)) {
      const nextMonth = this.permMonthAssessments[0];

      if (nextMonth.month === currentMonth) {
        nextMonth.assessment.forEach((assessment) => {this.currentMonthAssessments.push(assessment); });
        this.nextMonthAssessments.forEach((assessment) => {this.currentMonthAssessments.push(assessment); });
        this.deleteMonth(0, this.permMonthAssessments);
      }
    }

    this.permMonthAssessments.forEach((month) => {
      month.assessment.forEach((assessment) => {
        assessment.showDetails = {status: false, icon: 'chevron-down'};
      });
      this.monthAssessments.push(month);
      this.monthAssessments.sort((a: any, b: any) => a.sortID - b.sortID);
    });
    this.assignMonthID(this.monthAssessments);

    let oldAssessment = false;
    let oldAssessmentIDs = 0;
    let initialID = 0;

    this.currentMonthAssessments.forEach((assessment) => {
      const PERIOD = assessment.dueDate - Date.now();

      if ((PERIOD >= 0) || (assessment.dueDate === 0)) {
        assessment.showDetails = {status: false, icon: 'chevron-down'};
        this.setWeekAssessments(assessment, assessment.dueDate);
      } else {
        ++oldAssessmentIDs;
        if (oldAssessment === false) {
          initialID = assessment.id;
          oldAssessment = true;
        }
      }
    });
    this.deleteWeekAssessment(oldAssessmentIDs, initialID, 'currentMonth');

    oldAssessment = false;
    oldAssessmentIDs = 0;
    initialID = 0;

    this.nextMonthAssessments.forEach((assessment) => {
      if (assessment.date.month !== currentMonth) {
        assessment.showDetails = {status: false, icon: 'chevron-down'};
        this.setWeekAssessments(assessment, assessment.dueDate);
      } else {
        ++oldAssessmentIDs;
        if (oldAssessment === false) {
          initialID = assessment.id;
          oldAssessment = true;
        }
      }
    });
    this.deleteWeekAssessment(oldAssessmentIDs, initialID, 'nextMonth');
  }

  clearAssessments() {
    this.weekAssessments.forEach((week) => {
      week.assessment.splice(0, week.assessment.length);
    });
    this.monthAssessments.splice(0, this.monthAssessments.length);
  }

  filter(fltrSelected: boolean) {
    this.currentMonthAssessments.forEach((assessment) => {
      if (assessment.module === this.filters.selectedFilter) {
        if (fltrSelected) {
          this.weekAssessments[assessment.week].assessment.push(assessment);
          this.weekAssessments[assessment.week].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate); //optimise
          this.assignWeekAssessmentsID(assessment.week);
        } else {
          this.weekAssessments[assessment.week].assessment.splice(assessment.weekId, 1);
          this.assignWeekAssessmentsID(assessment.week);
        }
      }
    });

    this.nextMonthAssessments.forEach((assessment) => {
      if (assessment.module === this.filters.selectedFilter) {
        if (fltrSelected) {
          this.weekAssessments[assessment.week].assessment.push(assessment);
          this.weekAssessments[assessment.week].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate); //optimise
          this.assignWeekAssessmentsID(assessment.week);
        } else {
          this.weekAssessments[assessment.week].assessment.splice(assessment.weekId, 1);
          this.assignWeekAssessmentsID(assessment.week);
        }
      }
    });

    this.permMonthAssessments.forEach((month) => {
      month.assessment.forEach((assessment: any) => {
        if (assessment.module === this.filters.selectedFilter) {
          const id = this.getMonthID(month.month, this.monthAssessments);
          if (fltrSelected) {
            this.monthAssessments[id].assessment.push(assessment);
            this.monthAssessments[id].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
            this.assignMonthAssessmentID(month.month, this.monthAssessments);
          } else {
            this.monthAssessments[id].assessment.splice(assessment.id, 1);
            this.assignMonthAssessmentID(month.month, this.monthAssessments);
          }
        }
      });
    });
  }

  getModuleFilters() {
    let id = -1;
    this.filters.filter.splice(0, this.filters.filter.length);
    this.modules.forEach((module) => {
      this.filters.filter.push(
        {
          id: ++id,
          title: module.code,
          icon: 'school-outline',
          isSelected: false
        }
      );
    });
  }

  setWeekAssessments(assessment, dueDate: number) {
    const DAY = 86340000; // 1 minute (60000 ms) offset => 23h59
    const TOMORROW = 172740000; // 1 minute (60000 ms) offset => 23h59
    const WEEK = 604740000;
    const PERIOD = dueDate - Date.now();
    const TODAY = new Date();
    const DATE = new Date();
    const TIME_GONE_IN_DAY = this.getMilliseconds(TODAY.getHours(), TODAY.getMinutes());
    const TIME_GONE_IN_WEEK = (DAY * (TODAY.getDay())) + TIME_GONE_IN_DAY;
    const SOON = dueDate - (Date.now() - TIME_GONE_IN_DAY);
    DATE.setMilliseconds(PERIOD);

    if (PERIOD < 0) {
      assessment.week = 0;
      this.weekAssessments[0].assessment.push(assessment);
      this.assignWeekAssessmentsID(0);

    } else if ((PERIOD > 0) && (PERIOD < (WEEK - TIME_GONE_IN_WEEK))) {
      if ((SOON > 0) && (SOON < DAY)) {assessment.date.weekday = 'Today'; }
      if ((SOON > DAY) && (SOON < TOMORROW)) {assessment.date.weekday = 'Tomorrow'; }
      assessment.week = 1;
      this.weekAssessments[1].assessment.push(assessment);
      this.weekAssessments[1].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
      this.assignWeekAssessmentsID(1);

    } else if ((PERIOD > (WEEK - TIME_GONE_IN_WEEK)) && (PERIOD < ((2 * WEEK) - TIME_GONE_IN_WEEK))) {
      assessment.week = 2;
      this.weekAssessments[2].assessment.push(assessment);
      this.weekAssessments[2].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
      this.assignWeekAssessmentsID(2);

    } else {
      assessment.week = 3;
      this.weekAssessments[3].assessment.push(assessment);
      this.weekAssessments[3].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
      this.assignWeekAssessmentsID(3);
    }
  }

  undoDeleteWeekAssessment(assessment, week: number, assessmentMonth: string) {
    if (assessmentMonth === 'currentMonth') {
      this.currentMonthAssessments.push(assessment);
      this.currentMonthAssessments.sort((a: any, b: any) => a.dueDate - b.dueDate);
      this.assignCurrentMonthAssessmentsID();
      this.storeCurrentMonthAssessments();
    }

    if (assessmentMonth === 'nextMonth') {
      this.nextMonthAssessments.push(assessment);
      this.nextMonthAssessments.sort((a: any, b: any) => a.dueDate - b.dueDate);
      this.assignNextMonthAssessmentsID();
      this.storeNextMonthAssessments();
    }
    this.weekAssessments[week].assessment.push(assessment);
    this.weekAssessments[week].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
    this.assignWeekAssessmentsID(week);
  }

  undoDeleteMonthAssessment(assessment: any, month: string) {
    const tempMonthID = this.getMonthID(month, this.monthAssessments);
    const permMonthID = this.getMonthID(month, this.permMonthAssessments);

    this.monthAssessments[tempMonthID].assessment.push(assessment);
    this.permMonthAssessments[permMonthID].assessment.push(assessment);

    this.monthAssessments[tempMonthID].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);
    this.permMonthAssessments[permMonthID].assessment.sort((a: any, b: any) => a.dueDate - b.dueDate);

    this.assignMonthAssessmentID(month, this.monthAssessments);
    this.assignMonthAssessmentID(month, this.permMonthAssessments);
    this.storeMonthAssessments();
  }

  deleteWeekAssessment(oldAssessmentIDs: number, id: number, assessmentMonth: string, week?: number, weekId?: number) {
    if (week !== undefined) {
      this.weekAssessments[week].assessment.splice(weekId, oldAssessmentIDs);
      this.assignWeekAssessmentsID(week);
    }

    if (assessmentMonth === 'currentMonth') {
      this.currentMonthAssessments.splice(id, oldAssessmentIDs);
      this.assignCurrentMonthAssessmentsID();
      this.storeCurrentMonthAssessments();
    }

    if (assessmentMonth === 'nextMonth') {
      this.nextMonthAssessments.splice(id, oldAssessmentIDs);
      this.assignNextMonthAssessmentsID();
      this.storeNextMonthAssessments();
    }
  }

  deleteMonthAssesssment(id: number, month: string) {
    const tempMonthID = this.getMonthID(month, this.monthAssessments);
    const permMonthID = this.getMonthID(month, this.permMonthAssessments);
    // assessment from temporary assessment array
    const tempAssessment = this.monthAssessments[tempMonthID].assessment;

    // assessment from permenant assessment array
    const permAssessment = this.permMonthAssessments[permMonthID].assessment;

    tempAssessment.splice(id, 1);
    permAssessment.splice(id, 1);
    this.assignMonthAssessmentID(month, this.monthAssessments);
    this.assignMonthAssessmentID(month, this.permMonthAssessments);
    this.storeMonthAssessments();

    if (tempAssessment.length === 0  || tempAssessment === undefined || tempAssessment === null) {
          this.deleteMonth(tempMonthID, this.monthAssessments);
    }

    if (permAssessment.length === 0  || permAssessment === undefined || permAssessment === null) {
      this.deleteMonth(permMonthID, this.permMonthAssessments);
    }
  }

  deleteMonth(id: number, assessments: any) {
    assessments.splice(id, 1);
    this.assignMonthID(assessments);
    this.storeMonthAssessments();
  }

  async modulesOnInit() {
    let keys = [];
    await this.storage.keys()
    .then((data) => {keys = data; });

    if (keys[keys.indexOf('modules')] === 'modules') {
      await this.storage.get('modules')
    .then(
      (data) => {this.modules = data; this.getModuleFilters();}
    );
    }
  }

  async typesOnInit() {
    let keys = [];
    await this.storage.keys()
    .then((data) => {keys = data; });

    if (keys[keys.indexOf('types')] === 'types') {
      await this.storage.get('types')
    .then(
      (data) => {this.types = data;}
    );
    }
  }

  async storeMonthAssessments() {
    await this.storage.get('month_assessments')
    .then(
      ()  => {this.storage.remove('month_assessments');
              this.storage.set('month_assessments', this.permMonthAssessments); }
    );
  }

  async storeCurrentMonthAssessments() {
    await this.storage.get('currentMonth_assessments')
    .then(
      ()  => {this.storage.remove('currentMonth_assessments');
              this.storage.set('currentMonth_assessments', this.currentMonthAssessments); }
    );
  }

  async storeNextMonthAssessments() {
    await this.storage.get('nextMonth_assessments')
    .then(
      ()  => {this.storage.remove('nextMonth_assessments');
              this.storage.set('nextMonth_assessments', this.nextMonthAssessments); }
    );
  }

  async storeModules() {
    await this.storage.get('modules')
    .then(

      ()  => {this.storage.remove('modules');
              this.storage.set('modules', this.modules); }
    );
    this.getModuleFilters();
  }

  async storeTypes() {
    await this.storage.get('types')
    .then(
      ()  => {this.storage.remove('types');
              this.storage.set('types', this.types); }
    );
  }

  assignCurrentMonthAssessmentsID() {
    let id = -1;
    this.currentMonthAssessments.forEach(element => {
       ++id;
       element.id = id;
    });
  }

  assignNextMonthAssessmentsID() {
    let id = -1;
    this.nextMonthAssessments.forEach(element => {
       ++id;
       element.id = id;
    });
  }

  assignWeekAssessmentsID(week: number) {
    let id = -1;
    this.weekAssessments[week].assessment.forEach(element => {
       ++id;
       element.weekId = id;
    });
  }

  assignModuleID() {
    let id = -1;
    this.modules.forEach(element => {
       ++id;
       element.id = id;
    });
  }

  assignTypeID() {
    let id = -1;
    this.types.forEach(element => {
       ++id;
       element.id = id;
    });
  }

  assignMonthAssessmentID(month: string, assessments: any) {
    let id = -1;
    assessments[this.getMonthID(month, assessments)].assessment.forEach(element => {
       ++id;
       element.id = id;
    });
  }

  assignMonthID(assessments: any) {

    if (assessments === this.monthAssessments) {
      let id = -1;
      this.monthAssessments.forEach(element => {
        ++id;
        element.id = id;
     });
    }

    if (assessments === this.permMonthAssessments) {
      let id = -1;
      this.permMonthAssessments.forEach(element => {
        ++id;
        element.permId = id;
     });
    }
  }

  async presentAlert(title: string, subtitle: string, button: any ) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: subtitle,
      buttons: button
    });
    await alert.present();
  }

  async presentModal(modalComp: any) {
    const modal = await this.modalCtrl.create({
        component: modalComp,
        backdropDismiss: false
    });
    await modal.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      id: '0',
      message: msg,
      duration: 1000,
      color: 'dark',
      position: 'bottom',
      cssClass: 'ok-btn',
      buttons: [{text: 'OK', handler: () => {this.toastCtrl.dismiss('0'); }}]
    });
    await toast.present();
  }

  async presentUndoDeleteWeekAssessment(assessment, week: number, assessmentMonth: string) {
    const toast = await this.toastCtrl.create({
      id: '1',
      message: 'Assessment deleted',
      duration: 3000,
      color: 'dark',
      position: 'bottom',
      cssClass: 'undo-btn',
      buttons: [{text: 'UNDO', role: 'cancel',
      handler: () => {this.undoDeleteWeekAssessment(assessment, week, assessmentMonth); }}]
    });
    await toast.present();
  }

  async presentUndoDeleteMonthAssessment(assessment, month: string) {
    const toast = await this.toastCtrl.create({
      id: '2',
      message: 'Assessment deleted',
      duration: 3000,
      color: 'dark',
      position: 'bottom',
      cssClass: 'undo-btn',
      buttons: [{text: 'UNDO', role: 'cancel',
      handler: () => {this.undoDeleteMonthAssessment(assessment, month); }}]
    });
    await toast.present();
  }

  async presentPopover(popoverComp: any) {
    const popover = await this.popoverCtrl.create({
        component: popoverComp,
        cssClass: 'popover',
        translucent: false,
        backdropDismiss: true
    });
    await popover.present();
  }

  getTimezone(date: string): number {
    const DATE = new Date();
    DATE.setFullYear(parseInt(this.getYear(date), 10), parseInt(this.getMonthNo(date), 10) - 1, parseInt(this.getDay(date), 10));
    return this.getMilliseconds(0, DATE.getTimezoneOffset());
  }

  getMinute(time: string): string {
    return time.slice(14, 16);
  }

  getHour(time: string): string {
    return time.slice(11, 13);
  }

  getDay(date: string): string {
    return date.slice(8, 10);
  }

  getWeekday(day: number): string {
    switch (day) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
    }
  }

  getMilliseconds(hour: number, minute: number): number {
    const MINUTE_IN_MILLISECONDS = 60000;
    return ((hour * 60) + minute) * MINUTE_IN_MILLISECONDS;
  }

  getMonthNo(date: string): string {
    return date.slice(5, 7);
  }

  getMonth(date: string): {name: string; color: string; hexColor: string} {
    const month = this.getMonthNo(date);

    switch (month) {
        case '01':
          return {name: 'January', color: 'secondary', hexColor: '#3dc2ff'};
        case '02':
          return {name: 'February', color: 'primary', hexColor: '#3880ff'};
        case '03':
          return {name: 'March', color: 'tertiary', hexColor: '#5260ff'};
        case '04':
          return {name: 'April', color: 'secondary', hexColor: '#3dc2ff'};
        case '05':
          return  {name: 'May', color: 'primary', hexColor: '#3880ff'};
        case '06':
          return {name: 'June', color: 'tertiary', hexColor: '#5260ff'};
        case '07':
          return {name: 'July', color: 'secondary', hexColor: '#3dc2ff'};
        case '08':
          return {name: 'August', color: 'primary', hexColor: '#3880ff'};
        case '09':
          return {name: 'September', color: 'tertiary', hexColor: '#5260ff'};
        case '10':
          return {name: 'October', color: 'secondary', hexColor: '#3dc2ff'};
        case '11':
          return {name: 'November', color: 'primary', hexColor: '#3880ff'};
        case '12':
          return {name: 'December', color: 'tertiary', hexColor: '#5260ff'};
    }
  }

  getUTCMonth(month: number): string {
    switch (month) {
        case 0:
          return 'January';
        case 1:
          return'February';
        case 2:
          return 'March';
        case 3:
          return 'April';
        case 4:
          return 'May';
        case 5:
          return 'June';
        case 6:
          return 'July';
        case 7:
          return 'August';
        case 8:
          return 'September';
        case 9:
          return 'October';
        case 10:
          return 'November';
        case 11:
          return 'December';
    }
  }

  getYear(date: string): string {
    return date.slice(0, 4);
  }

  addMonth(name: string, assessments: any): number {
    assessments.push({
      id: undefined,
      permId: undefined,
      sortID: this.getMonthSortID(name),
      month: name,
      assessment: []
    });
    assessments.sort((a: any, b: any) => a.sortID - b.sortID);
    this.assignMonthID(assessments);
    return this.checkMonth(name, assessments);;
  }

  checkMonth(name: string, assessments: any): number {
    let monthID = -1;
    if (assessments === this.monthAssessments) {
      assessments.forEach((month) => {
        if (name === month.month) {
          monthID = month.id;
        }
      });
    }

    if (assessments === this.permMonthAssessments) {
      assessments.forEach((month) => {
        if (name === month.month) {
          monthID = month.permId;
        }
      });
    }
    return monthID;
  }

  getMonthID(month: string, assessments: any): number {
    const DOES_NOT_EXIST = -1;
    const monthID = this.checkMonth(month, assessments);

    if (monthID === DOES_NOT_EXIST) {
      return this.addMonth(month, assessments);
    } else {
      return monthID;
    }
  }

  getMonthSortID(month: string): number {
    switch (month) {
      case 'January':
        return 0;
      case 'February':
        return 1;
      case 'March':
        return 2;
      case 'April':
        return 3;
      case 'May':
        return 4;
      case 'June':
        return 5;
      case 'July':
        return 6;
      case 'August':
        return 7;
      case 'September':
        return 8;
      case 'October':
        return 9;
      case 'November':
        return 10;
      case 'December':
        return 11;
    }
  }
}
