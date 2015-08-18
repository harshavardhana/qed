/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright 2014 Harshavardhana <harsha@harshavardhana.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var config = {}
config.ws = {}
config.ws.host = window.location.hostname;
config.ws.port = 4002;

var WS = {
  host: config.ws.host,
  port: config.ws.port,
  client: null,
  message: {},

  start: function () {
    var serverHost = 'ws://' + this.host + ':' + this.port;
    this.client = new ReconnectingWebSocket(serverHost);
    var _this = this;
    this.client.addEventListener("open", function(event) {
      console.log('connected');
      if (_this.client.readyState != WebSocket.OPEN)
        throw new Error('Not connected');
      var message = {
        fname: null,
        event: 'init'
      };
      _this.client.send(JSON.stringify(message));
    });
    this.client.addEventListener('close', function(event) {
      cookie.remove('viewer');
      console.log('disconnected');
    });
    this.client.addEventListener('message', function(event) {
      var data = JSON.parse(event.data);
      switch (data.event) {
      case 'init':
        if (data.viewer !== 'undefined') {
          cookie.set('viewer', data.viewer, {
            expires: 3650, // expires in 10yrs
          });
        }
        break;
      case 'complete':
        console.log('Server reported send file: ' + data.path + ' Success');
        var event = document.createEvent('UIEvents');
        event.initUIEvent('openpdf', false, false, window, 0);
        event.pdfpath = data.path;
        window.dispatchEvent(event);
        break;
      case 'key':
        // if we reached final page do not progress further.
        // Right arrow keys now do not
        var skipped = false;
        if (data.keyevent.cmd === 0) {
          switch (data.keyevent.keyCode) {
            /* falls through */
            case 39:
            case 78: // 'j'
            case 79: // 'n'
              if ((data.pagenumber - 1) === PDFViewerApplication.pagesCount) {
                skipped = true;
              }
              break;
          }
        }
        if (skipped === true) {
          console.log("Presentation session finished!");
          break;
        }
        // Handle generic keypressed event
        var event = document.createEvent('UIEvents');
        event.initUIEvent('keypressedremote', false, true, window, 0);
        event.keyevent = data.keyevent;
        event.pagenumber = data.pagenumber
        window.dispatchEvent(event);
        break;
      case 'zoom':
        // Handle zoom click event
        if (data.clickevent == 'zoomIn') {
          PDFViewerApplication.zoomIn();
        } else if (data.clickevent == 'zoomOut') {
          PDFViewerApplication.zoomOut();
        }
        break;
      case 'select':
        PDFViewerApplication.setScale(data.scale);
        break;
      case 'pagenumber':
        // Handle generic pagenumber event
        var event = document.createEvent('UIEvents');
        event.initUIEvent('pagenumber', false, true, window, 0);
        event.pagenumber = data.pagenumber;
        window.dispatchEvent(event);
        break;
      case 'error':
        PDFViewerApplication.cleanup();
        cookie.remove('viewer');
        throw new Error('Server reported send error for file ' + data.path);
        break;
      default:
        PDFViewerApplication.cleanup();
        cookie.remove('viewer');
        throw new Error("Invalid unrecognized event");
      }
    });
  },
  sendFile: function(file) {
    if (this.client.readyState != WebSocket.OPEN)
      throw new Error('Not connected');
    this.message.fname = file.name;
    this.message.event = 'pdf';
    this.client.send(JSON.stringify(this.message));
    this.client.send(file);
  },
  sendKeyStroke: function(keyevent, value) {
    if (this.client.readyState != WebSocket.OPEN)
      throw new Error('Not connected');
    this.message.fname = null;
    this.message.event = 'key';
    this.message.keyevent = {};
    this.message.keyevent.keyCode = keyevent.keyCode;
    this.message.keyevent.cmd = ((keyevent.ctrlKey ? 1 : 0) |
                                 (keyevent.altKey ? 2 : 0) |
                                 (keyevent.shiftKey ? 4 : 0) |
                                 (keyevent.metaKey ? 8 : 0));
    this.message.pagenumber = value
    this.client.send(JSON.stringify(this.message));
  },
  sendMouseClick: function(clickAction) {
    if (this.client.readyState != WebSocket.OPEN)
      throw new Error('Not connected');
    this.message.fname = null;
    this.message.event = 'zoom';
    this.message.clickevent = clickAction;
    this.client.send(JSON.stringify(this.message));
  },
  sendMouseSelect: function(value) {
    if (this.client.readyState != WebSocket.OPEN)
      throw new Error('Not connected');
    this.message.fname = null;
    this.message.event = 'select';
    this.message.scale = value;
    this.client.send(JSON.stringify(this.message));
  },
  sendPageNumber: function(value) {
    if (this.client.readyState != WebSocket.OPEN)
      throw new Error('Not connected');
    this.message.fname = null;
    this.message.event = 'pagenumber';
    this.message.pagenumber = value;
    this.client.send(JSON.stringify(this.message));
  }
};
