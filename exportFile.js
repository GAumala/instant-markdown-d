const fs = require('fs')
const temp = require('temp')

function mdToStaticHtml(markdownBody, syntaxHighlightCss, markdownCss, customStyle) {
  return `<!DOCTYPE html>
    <html lang="en" class="">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta http-equiv="Content-Language" content="en">
      <style>
        ${syntaxHighlightCss}
      </style>
      <style>
        ${markdownCss}
      </style>
      <style>
        .markdown-body {
          min-width: 200px;
          max-width: 790px;
          margin: 0 auto;
          padding: 30px;
        }
        #con-error {
          position: fixed;
          top: 0px;
          right: 0px;
          padding: 5px;
          background: white;
          color: red;
        }
      </style>
      ${customStyle || ''}
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="repository-with-sidebar repo-container new-discussion-timeline with-full-navigation">
            <div id="js-repo-pjax-container" class="repository-content context-loader-container">
              <div id="readme" class="boxed-group flush clearfix announce instapaper_body md">
                <article class="markdown-body">
                  ${markdownBody}
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="con-error" style="display:none">Live preview is unavailable</div>
    </body>
    </html>`
}

function readCssFiles(markdown, syntax, callback) {
  fs.readFile(markdown, function (err, markdownData) {
    if (err) callback(err)
    else
      fs.readFile(syntax, function (err, syntaxData) {
        if (err) callback(err)
        else
          callback(null, markdownData.toString('utf-8'), syntaxData.toString('utf-8'))
      })
  })
}
/*
function renderPageInPhantom(originPath, destPath, callback) {
  phantom.create().then(function (phantom) {
    return phantom.createPage()
  }).then(function (page) {
    page.property('viewportSize', { width: 1020, height: 768 })
    page.property('paperSize', { format: 'A4', orientation: 'portrait', margin: '1cm' })
    page.property('zoomFactor', 1.5)
    page.open(originPath).then(function (status) {
      return page.render(destPath)
    })
    .then(function () {
      console.log('callback page')
      callback(page)
    })
  })
}
*/
function toHtml(dest, content, callback) {
  const pageWidth = 960
  const customStyle = `
    <style>
      #readme .markdown-body {
          border: 0px solid #ddd;
      }
      #js-repo-pjax-container {
        width: ${pageWidth}px;
      }

      .markdown-body {
        min-width: 200px;
        max-width: ${pageWidth}px;
      }
    </style>
    `
  readCssFiles(__dirname + '/github-markdown.css',
    __dirname + '/github-syntax-highlight.css',
    function (readError, markdownCss, syntaxHighlightCss) {
      if (readError)
        callback(readError)
      else {
        const html = mdToStaticHtml(content, markdownCss, syntaxHighlightCss, customStyle)
        fs.writeFile(dest, html, 'utf-8', function (writeError) {
          if(writeError)
            callback(writeError)
          else
            callback(null)
        })
      }
    })
}

/*
function toPdf(dest, content, callback) {
  readCssFiles(__dirname + '/github-markdown.css',
    __dirname + '/github-syntax-highlight.css',
    function (readError, markdownCss, syntaxHighlightCss) {
      const tempPath = temp.path({suffix: '.htm'})
      toHtml(tempPath, content, function (htmlError) {
        if (htmlError) callback(htmlError)
        else
          renderPageInPhantom(tempPath, dest, function (page) {
              //cleanup
              fs.unlink(tempPath)
              page.close()

              callback(null)
          })
      })
    })
}
*/
module.exports = toHtml
