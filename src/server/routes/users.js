var request = require("request");
const express = require("express");
const router = express.Router();
const application_keys = require("../../application-keys");
const okta_domain = application_keys.getKeys.okta_domain;
const okta_authorization = application_keys.getKeys.okta_authorization;

// Route: Get
// Description: Get all okta users
// Access: Private

router.get("/", async (req, res) => {
  try {
    var options = {
      method: "GET",
      url: `${okta_domain}/api/v1/users?limit=25`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${okta_authorization}`
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
      url: `${okta_domain}/api/v1/users/me`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${okta_authorization}`
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
