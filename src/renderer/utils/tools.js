import $$ from 'jquery'

$$(document).on('input', 'input', function (e) {
  if (e.target.id && e.target.id === 'searchKeywords') {

  } else {
    document.getElementById('SearchBox').style.display = 'none'
  }
})

$$(document).on('input', 'textarea', function (e) {
  if (e.target.id && e.target.id === 'searchKeywords') {

  } else {
    document.getElementById('SearchBox').style.display = 'none'
  }
})
