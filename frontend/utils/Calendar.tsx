import * as calendar from "expo-calendar";

export const Calendar = async () => {
  const { status } = await calendar.requestCalendarPermissionsAsync();

  console.log(status);
};

async function getDefaultCalendarSource() {
  const defaultCalendar = await calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

const addEventToCalendar = async (
  title: string,
  startDate: Date,
  endDate: Date,
  location: string
) => {
  try {
    const { status } = await calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      //console.log('Permissions granted. Fetching available calendars...')
      const calendars = await calendar.getCalendarsAsync(
        calendar.EntityTypes.EVENT
      );
      const defaultCalendar =
        calendars.find((calendar) => calendar.isPrimary) || calendars[0];
      if (defaultCalendar) {
        const eventConfig = {
          title,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          allDay: false,
          location,
        };
        //console.log('eventConfig:', eventConfig)
        const eventId = await calendar.createEventAsync(
          defaultCalendar.id,
          eventConfig
        );
        //console.log(eventId)
        alert("Success");
      } else {
        console.warn("No available calendars found.");
      }
    } else {
      console.warn("Calendar permission not granted.");
    }
  } catch (error) {
    console.warn(error);
  }
};
