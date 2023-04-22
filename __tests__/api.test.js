const axios = require("axios").default;
let baseUrl = "http://localhost:3007/api";
let phone = "869182411";

async function sendGetReq(route) {
  try {
    const response = await axios.get(`${baseUrl}/${route}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}
async function sendPostReq(route, data) {
  try {
    const response = await axios.post(`${baseUrl}/${route}`, data, {
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function sendPutReq(route, data) {
  try {
    const response = await axios.put(`${baseUrl}/${route}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function sendDeleteReq(route, data) {
  try {
    const response = await axios.delete(`${baseUrl}/${route}`, {
      headers: {},
    });
    return response;
  } catch (error) {
    console.error(error);
  }
}

describe("CRUD Operations", () => {
  test("should get a list of accounts", async () => {
    const res = await sendGetReq("public/accounts/");
    expect(res.status).toEqual(200);
    const tabUsers = res.data.accounts;
    expect(tabUsers[0]).toHaveProperty("name");
  });

  test("should create a accounts", async () => {
    const name = "tata_" + Date.now();
    const data = {
      name: name,
      phone: phone,
    };
    const res = await sendPostReq("public/account/", data);
    expect(res.status).toEqual(200);
  });

  test("should get a specific account by id", async () => {
    const res = await sendGetReq(`public/filter-account/?id=${1}`);
    expect(res.status).toEqual(200);
  });

  test("should update an existing account", async () => {
    const name = "tata_" + Date.now();
    let data = { name: name, phone: phone };
    const res = await sendPutReq(`public/update-account/`, data);

    expect(res.status).toEqual(200);
  });

  test("should delete an existing account", async () => {
    // setTimeout(function(){},2000);
    const res = await sendDeleteReq(`public/delete-account/?phone=${phone}`);
    expect(res.status).toEqual(200);
  });
});
