import React from "react";

export default function UserListItem(props){
  const handleLoginClick = (e) => props.onLoginClick(props.user);
  const handleDeleteClick = (e) => props.onDeleteClick(props.user.id);

  return (
    <tr className="Vlt-btn-on-hover">
      <td>{props.user.id}</td>
      <td>{props.user.name}</td>
      <td className="Vlt-btn-group Vlt-btn-group--hover">
        <button className="Vlt-btn Vlt-btn--tertiary" onClick={handleLoginClick}>Login</button>
        <button className="Vlt-btn Vlt-btn--destructive" onClick={handleDeleteClick}>Delete</button>
      </td>
    </tr>
  )
}