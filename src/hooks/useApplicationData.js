import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(initial) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // console.log("+++++", state.appointments)

  // useEffect to get days, appointments and interviewers from API and set state
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  // updates the day state with the new day
  const setDay = (day) => {
    setState({ ...state, day });
  };

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
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, [])
}