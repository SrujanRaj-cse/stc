const https = require("https");

console.log("Attempting to connect to Google...");

const options = {
  hostname: "www.google.com",
  port: 443,
  path: "/",
  method: "GET",
};

const req = https.request(options, (res) => {
  console.log("CONNECTED!");
  console.log("Status Code:", res.statusCode);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log("Data received. Test successful!");
  });
});

req.on("error", (e) => {
  console.error("--- TEST FAILED ---");
  console.error("Error Message:", e.message);
  console.error(e);
});

req.end();
