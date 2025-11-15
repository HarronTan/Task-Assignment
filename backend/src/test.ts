import axios from "axios";

const API = "http://localhost:5000/api"; // change if needed

async function runTests() {
  try {
    console.log("=== TEST 1: Create Task ===");
    const create = await axios.put(`${API}/tasks/assignment`, {
      taskId: 1,
      developerId: 1,
    });
    console.log(create.data);

  } catch (error: any) {
    if (error.response) {
      console.error("API ERROR:", error.response.status, error.response.data);
    } else {
      console.error("ERROR:", error);
    }
  }
}

runTests();
