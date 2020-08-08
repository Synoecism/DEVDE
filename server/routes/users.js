var request = require("request");
const express = require("express");
const router = express.Router();
const okta_domain_url = process.env.OKTA_DOMAIN_URL;
const okta_api_token = process.env.OKTA_API_TOKEN;

// Route: Get
// Description: Get all okta users
// Access: Private

router.get("/", async (req, res) => {
  try {
    var options = {
      method: "GET",
      url: `${okta_domain_url}/api/v1/users?limit=25`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${okta_api_token}`
      }
    };
    request(options, function(error, response) {
      if (error) {
        throw new Error(error);
      }
      return res.status(200).json(JSON.parse(response.body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Route: Get
// Description: Get current user
// Access: Private

router.get("/me", async (req, res) => {
  try {
    var options = {
      method: "GET",
      url: `${okta_domain_url}/api/v1/users/me`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${okta_api_token}`
      }
    };
    request(options, function(error, response) {
      if (error) {
        throw new Error(error);
      }
      return res.status(200).json(JSON.parse(response.body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
