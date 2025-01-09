import * as signalR from "@microsoft/signalr";

// Adresa vašeg backend-a, obavezno je promenite prema stvarnoj adresi
const URL =  "http://localhost:5157/notifications";

class NotificationConnector {
  private connection: signalR.HubConnection;

  // Singlton instanca
  static instance: NotificationConnector;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect()
      .build();

    // Startovanje veze sa SignalR
    this.connection.start().catch(err => {
      console.error("Error starting SignalR connection:", err);
      setTimeout(() => this.startConnection(), 5000); // Retry after 5 seconds
    });
  }

  // Reconnect the connection if it gets disconnected
  private startConnection() {
    this.connection.start().catch(err => {
      console.error("Error restarting SignalR connection:", err);
      setTimeout(() => this.startConnection(), 5000); // Retry after 5 seconds
    });
  }

  // Postavljanje event handler-a za primanje obaveštenja
  public events = (onMessageReceived: (message: string) => void) => {
    this.connection.on("ReceiveNotification", (message: string) => {
      onMessageReceived(message);
    });
  };

  // Slanje poruke
  public sendNotification = (userId: string, message: string) => {
    this.connection
      .send("SendMessageToUser", userId, message)
      .then(() => console.log("Notification sent"))
      .catch(err => console.error("Error sending notification", err));
  };

  // Singlton metoda za pristup instanci
  public static getInstance(): NotificationConnector {
    if (!NotificationConnector.instance)
      NotificationConnector.instance = new NotificationConnector();
    return NotificationConnector.instance;
  }
}

export default NotificationConnector.getInstance;
