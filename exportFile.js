const fs = require('fs')
const temp = require('temp')

function parseHtmlTemplate(html, options) {
  const lines = html.split(/\r?\n/)

  const {
    highlightCss,
    markdownBody,
    markdownCss,
    noBorder,
    noJS,
    pageCss,
    pageWidth,
  } = options

  let customStyle = ''

  if(markdownBody) {
      //in index.html template markdown-body div ends at line 19,
      //let's add html markdown there
      lines.splice(19, 0, markdownBody)
  }

  if(noBorder) customStyle += `
      #readme .markdown-body {
          border: 0px solid #ddd;
      }
    `

  if(pageWidth) customStyle += `
        #js-repo-pjax-container {
          width: ${pageWidth}px;
        }

        .markdown-body {
          max-width: ${pageWidth}px;
        }
      `
  if(customStyle.length > 0) {
      //in index.html template head ends at line 11, let's add new style there
      lines.splice(11, 0, `<style>${customStyle}</style>`)
  }

  if(noJS) {
    //index.html references 2 scripts. this starts at line 9. remove them
    lines.splice(9, 2)
  }

  if(pageCss) {
    //index.html references page css stylesheet in line 8. replace it
    lines.splice(8, 1, pageCss)
  }

  if(markdownCss) {
    //index.html references markdown css stylesheet in line 7. replace it
    lines.splice(7, 1, markdownCss)
  }

  if(highlightCss) {
    //index.html references syntax highlight css stylesheet in line 6. replace it
    lines.splice(6, 1, markdownCss)
  }

  return lines.reduce(function (left, right) {
    return left + '\n' + right
  })

}

function mdToStaticHtml(template, highlightCss, markdownCss, markdownBody, pageCss) {
  return parseHtmlTemplate(template, {
    highlightCss: highlightCss,
    markdownCss: markdownCss,
    pageCss: pageCss,
    markdownBody: markdownBody,
    noBorder: true,
    noJS: true,
    pageWidth: 960,
  })
}

function readFilePromise(filepath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filepath, function (err, data) {
      if (err) reject (err)
      else resolve (data)
    })
  })
}

function readTemplateFiles(html, highlight, markdown, pageStyle, callback) {
  let htmlString, highlightString, markdownString, pageStyleString
  readFilePromise(html)
    .then(function (data) {
      htmlString = data.toString('utf-8')
      return readFilePromise(markdown)
    }, callback)
    .then(function (data) {
      markdownString = data.toString('utf-8')
      return readFilePromise(pageStyle)
    }, callback)
    .then(function (data) {
      pageStyleString = data.toString('utf-8')
      return readFilePromise(highlight)
    }, callback)
    .then(function (data) {
      highlightString = data.toString('utf-8')
      callback(null, htmlString, highlightString, markdownString, pageStyleString)
    }, callback)
}

function toHtml(dest, content, callback) {
  const pageWidth = 960

  readTemplateFiles(__dirname + '/index.html', __dirname + '/github-syntax-highlight.css',
    __dirname + '/github-markdown.css', __dirname + '/style.css',
    function (readError, htmlTemplate, syntaxHighlightCss, markdownCss, pageCss) {
      if (readError)
        callback(readError)
      else {
        const html = mdToStaticHtml(htmlTemplate,
          `<style>${syntaxHighlightCss}</style>`, `<style>${markdownCss}</style>`,
          content, `<style>${pageCss}</style>`)
        fs.writeFile(dest, html, 'utf-8', function (writeError) {
          if(writeError)
            callback(writeError)
          else
            callback(null)
        })
      }
    })
}

module.exports = toHtml
