import React from "react";


export default function GenerateJWT(props){
  const [ jwt, setJWT ] = React.useState("");
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ apiKey, setApiKey ] = React.useState("");
  const [ apiSecret, setApiSecret ] = React.useState("");
  const [ applicationId, setApplicationId ] = React.useState("");

  const handleApiKeyChange = (e) => setApiKey(e.target.value);
  const handleApiSecretChange = (e) => setApiSecret(e.target.value);
  const handleApplicationIdChange = (e) => setApplicationId(e.target.value);
  const handleGenerateJwtClick = async () => {
    setIsLoading(true);
    const payload = { apiKey, apiSecret, applicationId };
    
    const res = await fetch(`${process.env.REACT_APP_API_JWT}/get-jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    setJWT(data.jwt);
    setIsLoading(false);

    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("apiSecret", apiSecret);
    localStorage.setItem("applicationId", applicationId);
    localStorage.setItem("applicationJwt", data.jwt);
    if(props.generateComplete) props.generateComplete(data.jwt);
  }

  return (
    <div>
      <div style={{ wordBreak: "break-all" }}>
        <p><b>JWT:</b></p>
        <p>{jwt}</p>
      </div>
      <div className="Vlt-form__element">
        <div className="Vlt-grid">
          <div className="Vlt-col">
            <label className="Vlt-label">API Key</label>
            <div className="Vlt-input">
              <input type="text" value={apiKey} onChange={handleApiKeyChange}/>
            </div>
          </div>
          <div className="Vlt-col">
            <label className="Vlt-label">API Secret</label>
            <div className="Vlt-input">
              <input type="text" value={apiSecret} onChange={handleApiSecretChange} type="password"/>
            </div>
          </div>
          <div className="Vlt-col">
          <label className="Vlt-label">Application ID</label>
          <div className="Vlt-input">
            <input type="text" value={applicationId} onChange={handleApplicationIdChange}/>
          </div>
        </div>
        </div>
        <button className="Vlt-btn Vlt-btn--primary Vlt-btn--app" onClick={handleGenerateJwtClick} disabled={isLoading}>
          {isLoading?<span className="Vlt-spinner Vlt-spinner--smaller Vlt-spinner--white"></span>:null}
          Generate JWT
        </button>
      </div>
    </div>
  )
}