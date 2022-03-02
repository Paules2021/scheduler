import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from 'hooks/useVisualMode';


export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVE = "SAVE";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //to save appointment
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVE);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  };

  // to delete appointment
  const onDelete = (id) => {
    // show "deleting" transition before cancelling is resolved
    transition(DELETE, true);
    props.cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_SAVE, true));
  };



  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === SHOW && <Show student={props.interview.student} interviewer={props.interview.interviewer} onEdit={() => transition(EDIT)} onDelete={() => transition(CONFIRM)} />}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => back(EMPTY)} onSave={save} />}
      {mode === SAVE && <Status message="Saving" />}
      {mode === DELETE && <Status message="Deleting" />}
      {mode === CONFIRM && <Confirm message="Do you want to delete this item?" onCancel={() => back(SHOW)} onConfirm={() => onDelete(props.id)} />}
      {mode === EDIT && <Form student={props.interview.student} interviewer={props.interview.interviewer ? props.interview.interviewer.id : null} interviewers={props.interviewers} onCancel={() => back(EMPTY)} onSave={save} />}
      {mode === ERROR_SAVE && <Error message="Cannot Save" onClose={() => back()} />}
      {mode === ERROR_DELETE && <Error message="Cannot Delete" onClose={() => back()} /> }
    </article>
  )
}