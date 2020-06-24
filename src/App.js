import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import HomePage from "pages/HomePage";
import DashboardPage from "pages/DashboardPage";

function PrivateRoute({ component: Component, ...rest }){
  return (
    <Route
      {...rest}
      render={(props) => {
        const user = localStorage.getItem("user");
        if(user) return <Component {...props}/>
        else return <Redirect to={{ pathname: "/", state: {from: props.location} }}/>
      }}/>
  )
}

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} exact/>
      <PrivateRoute path="/dashboard" component={DashboardPage} exact/>
    </Router>    
  )
}

export default App;
