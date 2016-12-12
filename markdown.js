const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');


const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        // Do nothing
      }
    } else {
      return str;
    }
  }
});

module.exports = md
