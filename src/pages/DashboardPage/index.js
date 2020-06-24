import React from "react";
import ConversationClient from "nexmo-client";

export default function DashboardPage(props){
  const [ user ] = React.useState(JSON.parse(localStorage.getItem("user")));
  const [ isReady, setIsReady ] = React.useState(false);
  const [ phoneNumber, setPhoneNumber ] = React.useState("6585773051");
  const [ currentCall, setCurrentCall ] = React.useState(null);
  const [ logs, setLogs ] = React.useState([]);
  const [ dtmf, setDtmf ] = React.useState([]);
  const [ application, setApplication ] = React.useState(null);

  const client = React.useRef(null);

  const handleError = (err) => console.error(err);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleCallPress = () => {
    if(application === null) handleError("No application running");
    else application.callServer(phoneNumber);
  }

  const handleHangUpClick = async () => {
    if(currentCall) await currentCall.hangUp();
    setDtmf([]);
  }

  const handleDtmfClick = async (e) => {
    if(currentCall){
      const newDtmf = e.target.getAttribute("data-index");
      const combinedDtmf = Array.from(dtmf);
      combinedDtmf.push(newDtmf);
      setDtmf(combinedDtmf);

      await currentCall.conversation.media.sendDTMF(newDtmf);
    }
  }

  const handleCallStatusChanged = async (call) => {
    const { STARTED, COMPLETED, BUSY, TIMEOUT, UNANSWERED, REJECTED, FAILED } = call.CALL_STATUS;
    
    if(call.status === STARTED) setCurrentCall(call);
    if(call.status === COMPLETED || call.status === BUSY || call.status === TIMEOUT || call.status === UNANSWERED || call.status === REJECTED || call.status === FAILED){
      setCurrentCall(null);
    }

    setLogs((logs) => [
      ...logs, 
      { conversationId: call.conversation.id, phoneNumber, direction: call.direction, callStatus: call.status }
    ]);
  }

  const initializeApplication = async () => {
    const userToken = localStorage.getItem("userToken");
    client.current = new ConversationClient();
    const application = await client.current.login(userToken);
    setApplication(application);
  };

  const initializeListener = () => {
    setIsReady(false);
    application.on("call:status:changed", handleCallStatusChanged)
    setIsReady(true);
  }

  React.useEffect(() => {
    if(application !== null) initializeListener()
    return function cleanup(){
      if(application) application.off("call:status:changed");
    }
  }, [ phoneNumber, application ])

  React.useEffect(() => {
    initializeApplication();
    return function cleanup(){
      if(client.current) client.current.logout();
      if(application.current) application.current.off("call:status:change");
    }
  }, [])
  
  return (
    <div className="Vlt-container Vlt-margin--A-top1 Vlt-margin--A-bottom1" style={{ margin: "0 auto" }}>
      <h1>Welcome, {user.name}</h1>
      <div className="Vlt-tabs">
        <div className="Vlt-tabs__header">
          <div className="Vlt-tabs__link Vlt-tabs__link_active"><span>In App to Phone Number</span></div>
        </div>
      </div>
      <div className="Vlt-margin--A-top4">
        <div className="Vlt-grid">
          <div className="Vlt-col">
            <p>This is a demo to call a PSTN number from in-app. You need to enter a phone number inside the box and press call button to initiate the call.</p>
            <div className="Vlt-form__element Vlt-form__element--big">
              <div className="Vlt-input">
                <input id="txtPhoneNumber" type="text" placeholder="eg. 658577301" value={phoneNumber} onChange={handlePhoneNumberChange}/>
                <label htmlFor="txtPhoneNumber">Phone Number</label>
              </div>
            </div>
            <button disabled={!isReady || currentCall !== null} className="Vlt-btn Vlt-btn--app" onClick={handleCallPress}>Call</button>
            <button disabled={!isReady || currentCall === null} className="Vlt-btn Vlt-btn--app" onClick={handleHangUpClick}>Hangup</button>
          </div>
          <div className="Vlt-col Vlt-center">
            <p><b>{dtmf.map((value) => value)}</b></p>
            <ul className="Vlt-list Vlt-list--simle">
              <li>
                <div className="Vlt-number Vlt-number--dialer" data-index="1" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
                <div className="Vlt-number Vlt-number--dialer" data-index="2" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
                <div className="Vlt-number Vlt-number--dialer" data-index="3" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
              </li>
              <li>
                <div className="Vlt-number Vlt-number--dialer" data-index="4" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
                <div className="Vlt-number Vlt-number--dialer" data-index="5" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
                <div className="Vlt-number Vlt-number--dialer" data-index="6" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
              </li>
              <li>
                <div className="Vlt-number Vlt-number--dialer" data-index="7" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
                <div className="Vlt-number Vlt-number--dialer" data-index="8" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
                <div className="Vlt-number Vlt-number--dialer" data-index="9" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
              </li>
              <li>
                <div className="Vlt-number Vlt-number--dialer" data-index="*" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
                <div className="Vlt-number Vlt-number--dialer" data-index="0" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
                <div className="Vlt-number Vlt-number--dialer" data-index="#" style={{ cursor: "pointer" }} onClick={handleDtmfClick}></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="Vlt-margin--A-top4">
        <div className="Vlt-table Vlt-table--data">
          <table>
            <thead>
              <tr>
                <th style={{ width: "50%" }}>Conversation ID</th>
                <th>Phone Number</th>
                <th>Direction</th>
                <th>Call Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => {
                return (
                  <tr key={index}>
                    <td>{log.conversationId}</td>
                    <td>{log.phoneNumber}</td>
                    <td>{log.direction}</td>
                    <td>{log.callStatus}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}