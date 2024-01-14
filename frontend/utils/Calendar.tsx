import * as calendar from "expo-calendar";

// DOES NOT WORK DUE TO REQUIRED A PAID APPLE ACCOOUNT (100+ DOLLARS A YEAR)

// export const Calendar = async () => {
//   const { status } = await calendar.requestCalendarPermissionsAsync();
// };

// async function getDefaultCalendarSource() {
//   const defaultCalendar = await calendar.getDefaultCalendarAsync();
//   return defaultCalendar.source;
// }

// export const AddEventToCalendar = async (
//   title: string,
//   startDate,
//   endDate,
//   location: string
// ) => {
//   try {
//     const { status } = await calendar.requestCalendarPermissionsAsync();
//     if (status === "granted") {
//       const calendars = await calendar.getCalendarsAsync(
//         calendar.EntityTypes.EVENT
//       );
//       const defaultCalendar =
//         calendars.find((calendar) => calendar.isPrimary) || calendars[0];
//       if (defaultCalendar) {
//         const eventConfig = {
//           title,
//           startDate: startDate.toISOString(),
//           endDate: endDate.toISOString(),
//           timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//           allDay: false,
//           location,
//         };

//         const eventId = await calendar.createEventAsync(
//           defaultCalendar.id,
//           eventConfig
//         );

//         alert("Success");
//       } else {
//         console.warn("No available calendars found.");
//       }
//     } else {
//       console.warn("Calendar permission not granted.");
//     }
//   } catch (error) {
//     console.warn(error);
//   }
// };
