import React from "react";

import UserList from "components/UserList";
import GenerateJWT from "components/GenerateJWT";

export default function HomePage(){
  const [ jwt, setJwt ] = React.useState("");

  const handleJwtGenerateComplete = (jwt) => setJwt(jwt);

  return (
    <div className="Vlt-container Vlt-margin--A-top1 Vlt-margin--A-bottom1" style={{ margin: "0 auto" }}>
      <h1>In-App to PSTN with DTMF</h1>
      <GenerateJWT generateComplete={handleJwtGenerateComplete}/> 
      {jwt?(
        <div>
          <UserList jwt={jwt}/>
        </div>
      ): null}
    </div>
  )
}