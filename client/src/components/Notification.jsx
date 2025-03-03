import { useEffect, useState } from "react";
const Notification = ()=>{
    
    useEffect(() => {
        console.log("Notification component component mounted");
      
        let eventSource;
        try {
          eventSource = new EventSource("http://localhost:5000/notification", { withCredentials: true });
        
          eventSource.onopen = (event) => {
            console.log("EventSource opened", event); 
          };
          
          eventSource.onmessage = (event) => {
            console.log("I am inside onmessage event of Notification component");
            var data = JSON.parse(event.data);
            console.log("This is Notification component ", data);
      
           
          };
      
          eventSource.onerror = (error) => {
            console.log("EventSource error:", error);
            if (event.target.readyState === EventSource.CLOSED) {
                console.log("🔴 SSE Connection was closed by the server");
            } else if (event.target.readyState === EventSource.CONNECTING) {
                console.log("🟡 SSE is trying to reconnect...");
            }
        
            eventSource.close();
          };
      
        } catch (error) {
          console.error("EventSource failed", error);
        }
      
       
      }, []);
      
    return (
        <div className="notification">
            <h1>Notification</h1>
            <p>Notification message</p>
        </div>
    )
}
export default Notification;