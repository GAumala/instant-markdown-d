const fs = require('fs')

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

}function parseHtmlTemplate(html, options) {
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

module. exports = {
  initIndexPage: function (pageWidth) {
    let indexPage = fs.readFileSync(__dirname + '/indexTemplate.html').toString('utf-8')

    if (pageWidth) {
      indexPage = parseHtmlTemplate(indexPage, {pageWidth: 960})
    }

    fs.writeFileSync(__dirname + '/index.html', indexPage, 'utf-8')
  },

  parseHtmlTemplate: parseHtmlTemplate
}
