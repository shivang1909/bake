
const clients = new Map(); // userId => { res, role }

const handleSSEConnection = (req, res) => {
    console.log("inside sseHandler controller");

  const user = req.userId; // Decoded from token by middleware
  console.log("this is user",user);
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client

  // Save client
  clients.set(user, { res, role: req.role });

  console.log(`🔌 Connected:`, Array.from(clients.entries()));

  // Send initial heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    res.write('event: ping\ndata: {}\n\n');
  }, 30000); // every 30 seconds

  // Clean up on disconnect
  req.on('close', () => {
    console.log(`❌ Disconnected: ${user}`);
    clearInterval(heartbeat);
    clients.delete(user);
  });
};

const orderstatuschange = (data) => {
     console.log("Notification check data:", data); // Debugging line
    for (const [id, client] of clients.entries()) {
        
          if(client.role === "Admin") {
        client.res.write(`event: admin-event\ndata: ${JSON.stringify(data)}\n\n`);
               

    }
      
    }
    return;
  

};
const codupdatebydeliverypartner= (data) => {    
    
    for (const [id, client] of clients.entries()) {
        if(client.role === "Admin") {
            console.log('inside if of cod s',client.role)
        client.res.write(`event: cod-status-update\ndata: ${JSON.stringify(data)}\n\n`);
                console.log(data);

    }
    }
    return;

}
const newordersseHandler = (data)=> {
    for (const [id, client] of clients.entries()) {
        if(client.role === "Admin") {
            console.log('inside if of cod s',client.role)
        client.res.write(`event: new-order\ndata: ${JSON.stringify(data)}\n\n`);
                console.log(data);
    } 
}
}
const deliveryPartnerNotification = (data) => { 
  for (const [id, client] of clients.entries()) {
     console.log('inside if of delivery s',id);
     console.log('inside if of delivery s',data);
    if(client.role === "Delivery Partner" && id === data.deliveryPartnerId) {
           console.log('in condition ');

    client.res.write(`event: Delivery-notification\ndata: ${JSON.stringify(data)}\n\n`);
            console.log(data);
} 
}

}
export { handleSSEConnection, orderstatuschange,codupdatebydeliverypartner,newordersseHandler,deliveryPartnerNotification };
