import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: "local",
  wsHost: "localhost",
  wsPort: 8080,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ["ws"],
});

export default echo;
