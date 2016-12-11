window.onload = function () {
  console.log('loaded')
  var socket = io.connect('http://'+ window.location.host +'/');
  socket.on('connect', function () {
    setDisconnected(false);
    socket.on('newContent', function(newHTML) {
      document.querySelector(".markdown-body").innerHTML = newHTML;
    });
    socket.on('die', function(newHTML) {
      window.open('', '_self', '');
      window.close();

      var firefoxWarning =
      "<h1>Oops!</h1>" +
      "<h3>Firefox doesn't allow windows to self-close.</h3>" +
      "<h3>If you want the preview window to close automatically like in other browsers, go to about:config and set dom.allow_scripts_to_close_windows to true.</h3>"
      document.body.innerHTML = firefoxWarning;
    });
  });
  socket.on('disconnect', function() {
    setDisconnected(true);
  });

  try {
    eval('// If CSP is active, then this is blocked');
  } catch (e) {
    // Detected that the CSP was active (by the user's preference).
    // Drop capabilities to prevent rendered markdown from executing scripts.
    var meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', "script-src 'none';");
    document.head.appendChild(meta);
  }

  function setDisconnected(isDisconnected) {
    document.getElementById('con-error').style.display =
      isDisconnected ? 'block' : 'none';
  }
}
