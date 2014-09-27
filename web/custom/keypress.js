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

var pressedKeys = [999999,];
$(document.body).keydown(function (evt) {

    if (pressedKeys.indexOf(evt.keyCode) == -1) {
        pressedKeys.push(evt.keyCode);
        console.log("down" + evt.keyCode);
        ws.send(evt.keyCode + ':d');
    }
});

$(document.body).keyup(function (evt) {
        if (pressedKeys.indexOf(evt.keyCode)) {
            var index = pressedKeys.indexOf(evt.keyCode);
            pressedKeys.splice(index,1);
            console.log("up" + evt.keyCode);
            ws.send(evt.keyCode + ':u');
    }

});
