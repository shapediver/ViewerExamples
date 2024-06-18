

import {
  addListener,
  createSession,
  createViewport,
  EVENTTYPE,
  removeListener
} from "@shapediver/viewer";

const sendNotification = (title: string, message: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, { body: message });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body: message });
      }
    });
  }
};

(async () => {
  // create a viewport
  const viewport = await createViewport({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    id: "myViewport"
  });
  // create a session
  const session = await createSession({
    ticket:
      "319f14f08c1e67a874fd843acecfd321049772deb0cdb5a0dbb39385592a156e83730e45c5e7af5eab52e15b1e36d44a092f71ada1331e1935b0f25d9448af34d0add0bd5abf8984325b97ee9e6106b25216446d15a86bb18b40114df89d2f5909b08e8c8b9eeb-7516be37cb2d968a0b3c545baf3ae51e",
    modelViewUrl: "https://sdeuc1.eu-central-1.shapediver.com",
    id: "mySession"
  });

  // create a listener that is called whenever the session has been customized
  const token = addListener(EVENTTYPE.SESSION.SESSION_CUSTOMIZED, (e) => {
    sendNotification("Session customized", `Session customized: ${JSON.stringify(e)}`);
  });

  session.getParameterByName("Length")[0].value = 10;
  await session.customize();

  // once you are done listening, remove the listener
  // removeListener(token)
})();
