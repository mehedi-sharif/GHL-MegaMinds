import contactWorker from "../src/worker.js";

export default {
  fetch(request) {
    return contactWorker.fetch(request, {
      GHL_SubAccount_API_Key: process.env.GHL_SubAccount_API_Key,
      GHL_SubAccount_LocationId: process.env.GHL_SubAccount_LocationId,
    });
  },
};