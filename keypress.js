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
