import React from "react";

import "components/Application.scss";
import DayList from "components/DayList";
import { useState, useEffect } from "react";
import Appointment from "components/Appointment";
import axios from "axios";



import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
console.log("+++++", state.appointments)
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

//function to create appointment
  const bookInterview = (id, interview) => {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // PUT request to update the database with the interview data
    return axios.put(`http://localhost:8001/api/appointments/${id}`, {
      interview
    })
      .then((res) => {
        setState((prev) => ({
          ...prev,
          appointments
        }));
      })
  }
  
  //delete appointment
  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    //DELETE request to update the database with the interview data
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then((res) => {
        setState((prev) => ({
          ...prev,
          appointments
        }));
      })
  };


  // updates the day state with the new day
  const setDay = (day) => {
    setState({ ...state, day });
  };


  // useEffect to get days from API
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers:all[2].data}));
      });
  }, [])

  const appointmentArray = dailyAppointments.map((appointment) => {
    return <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={getInterview(state, state.appointments[appointment.id].interview)}
      interviewers={dailyInterviewers}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
    />
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentArray}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
