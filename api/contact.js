import contactWorker from "../src/worker.js";

export default {
  fetch(request) {
    return contactWorker.fetch(request, {
      GHL_SUBACCOUNT_API_KEY: process.env.GHL_SUBACCOUNT_API_KEY,
      GHL_SUBACCOUNT_LOCATION_ID: process.env.GHL_SUBACCOUNT_LOCATION_ID,
    });
  },
};
