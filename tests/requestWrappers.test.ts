import { sendRequest } from "../src/requestWrappers";

test("makeGetRequest", async () => {
  // expect 200 response from google.com
  expect(
    await sendRequest({ uri: "https://google.com", method: "GET" })
  ).toHaveProperty("status", 200);
});
