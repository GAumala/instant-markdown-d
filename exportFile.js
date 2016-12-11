const fs = require('fs')
const temp = require('temp')

function mdToStaticHtml(markdownBody, syntaxHighlightCss, markdownCss) {
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

function newTempHtmlFile(html, callback) {
  //const tempPath = temp.path({suffix: '.htm'})
  fs.writeFile('/home/gesuwall/Downloads/md.html', html, 'utf8', callback)
}

module.exports = function (content) {
  const markdownCss = fs.readFileSync(__dirname + '/github-markdown.css')
                              .toString('utf-8')
  const syntaxHighlightCss = fs.readFileSync(__dirname + '/github-syntax-highlight.css')
                              .toString('utf-8')

  const html = mdToStaticHtml(content, markdownCss, syntaxHighlightCss)
  fs.writeFileSync('/home/gesuwall/Downloads/md.html', html, 'utf-8')

}
