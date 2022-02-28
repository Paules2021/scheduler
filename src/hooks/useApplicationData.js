import  { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(initial) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // useEffect to get days, appointments and interviewers from API 
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


  const updateSpots = (requestType) => {
    const index = state.days.findIndex(day => day.name === state.day);
    const days = state.days;

    if (requestType === "create") {
      days[index].spots -= 1
    } else {
      days[index].spots += 1
    }
    return days;
  }



  // updates the day state with the new day
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
        const days = updateSpots("create")
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
        const days = updateSpots()
        setState((prev) => ({
          ...prev,
          appointments,
          days
        }));
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}