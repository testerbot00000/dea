const fs = require('fs')
const path = require('path')
const readline = require('readline')
const ignoredCategories = ['table_of_contents', 'tips', 'contribute', 'license']
const headingPattern = /^## /
const subHeadingPattern = /^### /
const itemPattern = /^- \[(.*)\]\((\S*)\)(.*)/
const slug = function slug (str) { return str.toLowerCase().replace(/ /g, '_')}

var awesome = []
var category
var subcategory

readline.createInterface({
  input: fs.createReadStream('readme.md', 'utf8')
})
  .on('line', (line) => {

    // Is line a heading?
    if (line.match(headingPattern)) {
      var cat = slug(line.replace(headingPattern, ''))
      if (ignoredCategories.indexOf(cat) > -1) return
      category = cat
      subcategory = null
      return
    }

    // Is line a subheading?
    if (line.match(subHeadingPattern)) {
      subcategory = slug(line.replace(subHeadingPattern, ''))
      return
    }

    // Is line an awesome thing?
    var parts = line.match(itemPattern)
    if (parts && category) {
      var item = {
        name: parts[1],
        href: parts[2],
      }
      if (parts[3]) item.description = parts[3].replace(/.* - /, '')
      item.category = category
      if (subcategory) { item.subcategory = subcategory}

      // skip local deep links
      if (item.href && item.href.match(/^#/)) return

      awesome.push(item)
    }
  })
  .on('close', function () {
    process.stdout.write(JSON.stringify(awesome, null, 2))
  })
