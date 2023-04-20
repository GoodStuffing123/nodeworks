// const { read, write } = require("../utility/manageData");

const makeAddress = (id) => ({ id, lastPing: Date.now() });
const addressTimeout = 60 * 1000;

const routes = (app) => {
  app.get("/", (req, res) => {
    res.send("<a href=\"/messages\">Messages</a>");
  });

  let addresses = [];

  // Distribute addresses to user and add them to the address list
  app.get("/addresses", (req, res) => {
    const currentDate = Date.now();
    for (let i = addresses.length - 1; i > -1; i--) {
      if (currentDate - addresses[i].lastPing > addressTimeout) {
        addresses.splice(i, 1);
      }
    }

    res.send(addresses);

    addresses.push(makeAddress(req.query.peerId));
  });

  // Ping must happen at most once per minute or they are queued for removal from list
  app.get("/ping", (req, res) => {
    const newAddress = req.query.peerId;
    const addressIndex = addresses.findIndex((address) => address.id === newAddress);
    if (addressIndex === -1) {
      addresses.push(makeAddress(newAddress));
    } else {
      addresses[addressIndex] = makeAddress(newAddress);
    }

    res.status(200).send();
  });
}

module.exports = routes;