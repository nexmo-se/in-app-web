import React from "react";
import { withRouter } from "react-router";

import UserListItem from "components/UserListItem";

function UserList(props){
  const [ users, setUsers ] = React.useState([]);
  const [ newUserName, setNewUserName ] = React.useState("");
  const [ newUserModal, setNewUserModal ] = React.useState(null);

  const handleNewUserNameChange = (e) => setNewUserName(e.target.value);
  const handleOpenAddUserModal = () => newUserModal.open();
  const handleSaveNewUser = async () => {
    const payload = { name: newUserName, display_name: newUserName }
    await fetch("https://api.nexmo.com/beta/users", {
      method: "POST", body: JSON.stringify(payload),
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${props.jwt}`
      }      
    });
    await fetchData()
    newUserModal.dismiss();
  }

  const handleUserLogin = async (user) => {
    const payload = {
      apiKey: localStorage.getItem("apiKey"),
      apiSecret: localStorage.getItem("apiSecret"),
      applicationId: localStorage.getItem("applicationId"),
      sub: user.name
    }

    const data = await(await fetch(`${process.env.REACT_APP_API_JWT}/get-user-jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })).json();
    const { jwt } = data;

    localStorage.setItem("userToken", jwt);
    localStorage.setItem("user", JSON.stringify(user));
    props.history.replace("/dashboard");
  }

  const handleUserDelete = async (userId) => {
    await fetch(`https://api.nexmo.com/beta/users/${userId}`, { 
      method: "DELETE", headers: { "Authorization": `Bearer ${props.jwt}`}
    });
    await fetchData();
  }

  const fetchData = async () => {
    if(!props.jwt) return;
    const res = await fetch(`https://api.nexmo.com/beta/users`, { 
      method: "GET", headers: { "Authorization": `Bearer ${props.jwt}` }
    });
    const data = await res.json();
    setUsers(data);
  }

  React.useEffect(() => {
    fetchData()
    setNewUserModal(window.Volta.modal.create("add-user-modal"));
  }, [])

  return (
    <div className="Vlt-margin--A-top4">

      <div id="add-user-modal" className="Vlt-modal">
        <div className="Vlt-modal__panel">
          <div className="Vlt-modal__header">
            <h4>Add User</h4>
            <div className="Vlt-modal__dismiss"></div>
          </div>
          <div className="Vlt-modal__content">
            <div className="Vlt-form__element Vlt-form__element--big">
              <div className="Vlt-input">
                <input type="text" placeholder="Jane" id="new-user-name" onChange={handleNewUserNameChange} value={newUserName}/>
                <label htmlFor="new-user-name">Name</label>
              </div>
            </div>
          </div>
          <div className="Vlt-modal__footer">
            <button className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary Vlt-modal__cancel">Cancel</button>
            <button className="Vlt-btn Vlt-btn--app Vlt-btn--primary" onClick={handleSaveNewUser}>Save</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <h4>User List</h4>
        <button className="Vlt-btn Vlt-btn--primary" onClick={handleOpenAddUserModal}>
          Add User
        </button>
      </div>
      {users.length === 0?(
        <div className="Vlt-empty">
          <div className="Vlt-empty__content">
            There is no user here. You can add user by clicking "Add User" button.
          </div>
        </div>
      ): (
        <div className="Vlt-table Vlt-table--data">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return <UserListItem key={index} user={user} onLoginClick={handleUserLogin} onDeleteClick={handleUserDelete}/>
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default withRouter(UserList);