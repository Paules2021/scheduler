import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })
  const formatSpot = (spots) => {
    if (spots === 0) {
      return "no spots remaining"
    }
    if (spots > 1) {
      return `${spots} spots remaining`
    }
    else {
      return `${spots} spot remaining`
    }
  }
  return (
    <li className={dayClass} data-testid="day" onClick={() => props.setDay(props.name)} selected={props.selected}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpot(props.spots)}</h3>
    </li>
  );
}