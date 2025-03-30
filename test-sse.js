import EventSource from "eventsource";

const url = "http://localhost:1337/example_tool";
const eventSource = new EventSource(url);

eventSource.onmessage = (event) => {
  console.log("Received event:", event.data);
};

eventSource.onerror = (error) => {
  console.error("SSE error:", error);
};