define({ "api": [
  {
    "type": "get",
    "url": "/sc",
    "title": "Request a screenshot",
    "group": "Main",
    "description": "<p>This endpoint requests a screenshot of the page at a user supplied url, that will be cached. The user can supply various parameters, to define things like the viewport size, scaled picture sizes, js execution and more.</p>",
    "name": "ScreenshotCreate",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-+Infinity",
            "optional": false,
            "field": "w",
            "defaultValue": "1024",
            "description": "<p>viewport width</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-+Infinity",
            "optional": false,
            "field": "h",
            "defaultValue": "768",
            "description": "<p>viewport height</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-+Infinity",
            "optional": false,
            "field": "sw",
            "defaultValue": "null",
            "description": "<p>optional: scaled image width</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-+Infinity",
            "optional": false,
            "field": "sh",
            "defaultValue": "null",
            "description": "<p>optional: scaled image height</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "nojs",
            "defaultValue": "false",
            "description": "<p>disables js execution on the screenshotted page</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "fp",
            "defaultValue": "false",
            "description": "<p>screenshot full page height (this overrides h)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "1-60",
            "optional": false,
            "field": "delay",
            "defaultValue": "null",
            "description": "<p>optional: delay the screenshot for x seconds (use when the site is very js heavy)</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/server.ts",
    "groupTitle": "Main"
  }
] });