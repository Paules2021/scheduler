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



export function getInterview(state, interview) {
  if (interview === null) {
    return null;
  }
  // get the id of the interviewer from the interview
  let interviewerID = interview.interviewer;
  // get the interviewer info as we now have their id
  const interviewerInfo = state.interviewers[interviewerID];
  // copy all the info and update just the interviewer property
  return {...interview, interviewer: interviewerInfo}
}

export function getInterviewersForDay(state, day) {
  //... returns an array of interviewers for that day
  let interviewerIdArray = [];
  let interviewerArray = [];
  for (const eachDay of state.days) {
    if (eachDay.name === day) {
      interviewerIdArray = eachDay.interviewers;
    }
  }

  if (interviewerIdArray.length === 0) {
    return [];
  }

  for (const interviewer of interviewerIdArray) {
    interviewerArray.push(state.interviewers[interviewer]);
  }
  return interviewerArray;
} 