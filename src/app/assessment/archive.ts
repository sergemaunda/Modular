// setChip(date: string, type: string): object {
//     const  chipDate = date.slice(0, date.length - 5);
//     const Period = Date.parse(date) - Date.now();

//     if (isNaN(Period) === true) {

//       if (type === 'Presentation') {
//         return {color: 'warning', item: {icon: 'easel-outline'}, day: {time: 'Alert', color: 'warning', date: 'Due soon'}};
//       } else {
//         if (type === 'Assignment') {
//           return {color: 'warning', item: {icon: 'laptop-outline'}, day: {time: 'Alert', color: 'warning', date: 'Due soon'}};
//         } else {
//           return {color: 'warning', item: {icon: 'flask-outline'}, day: {time: 'Alert', color: 'warning', date: 'Due soon'}};
//         }
//       }
//     }

//     if (Period < 0) {                                           // today
//         if (type === 'Presentation') {
//             return {color: 'success', item: {icon: 'easel-outline'}, day: {time: 'Good luck!', color: 'success', date: 'Due today'}};
//         } else {
//             if (type === 'Assignment') {
//                 return {color: 'success', item: {icon: 'laptop-outline'}, day: {time: '', color: 'success', date: 'Due today'}};
//             } else {
//                 return {color: 'success', item: {icon: 'flask-outline'}, day: {time: 'Good luck!', color: 'success', date: 'Due today'}};
//             }
//         }
//     }

//     if (Period > 0 && Period < 86400000 ) {        // tomorrow
//         if (type === 'Presentation') {
//             return {color: 'danger', item: {icon: 'easel-outline'}, day: {time: 'Finish', color: 'danger', date: 'Due tomorrow'}};
//         } else {
//             if (type === 'Assignment') {
//                 return {color: 'danger', item: {icon: 'laptop-outline'}, day: {time: 'Finish', color: 'danger', date: 'Due tomorrow'}};
//             } else {
//                 return {color: 'danger', item: {icon: 'flask-outline'}, day: {time: 'Study', color: 'danger', date: 'Due tomorrow'}};
//             }
//         }
//     }

//     if (Period > 86400000 && Period < 432000000) {             // one week

//         if (type === 'Presentation') {
//             return {color: 'warning', item: {icon: 'easel-outline'}, day: {time: 'Finish', color: 'primary', date: chipDate}};
//         } else {
//             if (type === 'Assignment') {
//                 return {color: 'warning', item: {icon: 'laptop-outline'}, day: {time: 'Finish', color: 'primary', date: chipDate}};
//             } else {
//                 return {color: 'warning', item: {icon: 'flask-outline'}, day: {time: 'Study', color: 'success', date: chipDate}};
//             }
//         }
//     }

//     if (Period > 172800000 && Period < 1209600000 ) {           // two weeks

//         if (type === 'Presentation') {
//             return {color: 'warning', item: {icon: 'easel-outline'}, day: {time: 'Start', color: 'success', date: chipDate}};
//         } else {
//             if (type === 'Assignment') {
//                 return {color: 'warning', item: {icon: 'laptop-outline'}, day: {time: 'Start', color: 'success', date: chipDate}};
//             } else {
//                 return {color: 'warning', item: {icon: 'flask-outline'}, day: {time: 'Upcoming', color: 'warning', date: chipDate}};
//             }
//         }
//     }

//     if (Period > 1209600000) {                                 // more than two weeks
//       if (type === 'Presentation') {
//           return {color: 'secondary', item: {icon: 'easel-outline'}, day: {time: '', color: '', date: chipDate}};
//       } else {
//           if (type === 'Assignment') {
//               return {color: 'secondary', item: {icon: 'laptop-outline'}, day: {time: '', color: '', date: chipDate}};
//           } else {
//               return {color: 'secondary', item: {icon: 'flask-outline'}, day: {time: '', color: '', date: chipDate}};
//           }
//       }
//     }
//   }
