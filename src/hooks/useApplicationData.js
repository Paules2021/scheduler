import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(initial) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // useEffect to get days, appointments,interviewers from API 
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  // function update the spots
  const updateSpots = (state, appointments, id) => {
    let newAppointments = [];
    let index = 0;
    for (const day of state.days) {
      if (day.appointments.includes(id)) {
        newAppointments = [...day.appointments];
        index = day.id - 1;
      }
    }
    let counter = 0;
    for (const appointment of newAppointments) {
      if (appointments[appointment].interview === null) {
        counter++;
      }
    }
    const day = {
      ...state.days[index],
      spots: counter
    }
    const daysArray = [
      ...state.days
    ]
    daysArray[index] = day
    return daysArray;

  };


  // updates day state with  new day
  const setDay = (day) => {
    setState({ ...state, day });
  };

  // function to create appointment
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    // PUT request to update the database with the interview data
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, {
        interview,
      })
      .then((res) => {
        const days = updateSpots(state, appointments, id)
        setState((prev) => ({
          ...prev,
          appointments,
          days
        }));
      });
  };

  // function to delete appointment
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    //DELETE request to update the database with the interview data
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then((res) => {
        const days = updateSpots(state, appointments, id)
        setState((prev) => ({
          ...prev,
          appointments,
          days
        }));
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}