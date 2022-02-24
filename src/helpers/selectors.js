export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  let appointmentIdArray = [];
  let appointmentArray = [];
  for (const eachDay of state.days) {
    if (eachDay.name === day) {
      appointmentIdArray = eachDay.appointments;
    }
  }
  if (appointmentIdArray.length === 0) {
    return [];
  }
  for (const appointment of appointmentIdArray) {
    appointmentArray.push(state.appointments[appointment]);
  }
  return appointmentArray;
} 