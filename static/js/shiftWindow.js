function shiftWindow() { if ((location.hash.indexOf('window.') == 1) || (location.hash.indexOf('prop-') == 1)) if (window.innerWidth < "1024") {scrollBy(0, -158)} else {scrollBy(0, -60)};
};
function toggleDetails() { if ((location.hash.indexOf('window.') == 1) || (location.hash.indexOf('prop-') == 1)) {
var prop = document.getElementById(location.hash.substr(1));
var parentDetails = [];
var parent = prop.parentNode;
while (parent) { if (parent.tagName === 'DETAILS') parentDetails.push(parent); parent = parent.parentNode; }
for (i = 0; i < parentDetails.length; i++) {
  parentDetails[i].setAttribute('open','')
}
prop.scrollIntoView();
}};
function toggleAllDetails(t) {
if (t == 'js') { var type = 'js-support-table' } else if (t == 'css') { var type = 'prop-list' };
var g = document.getElementById(type);
var d = g.getElementsByTagName('details');
var id = 'toggle-' + t;
var a = document.getElementById(id);
if ( a.hasAttribute('open') == false ) {
for (i=0; i < d.length; i++) {
  d[i].setAttribute('open','');
  a.setAttribute('open','');
  event.preventDefault();
}}
else if ( a.hasAttribute('open') == true ) {
for (i=0; i < d.length; i++) {
  d[i].removeAttribute('open');
  a.removeAttribute('open');
  event.preventDefault();
}}
if ( t == 'js' ) { document.getElementById('.window').parentElement.setAttribute('open','') }
}
window.addEventListener("load",  function() { toggleDetails(); shiftWindow(); });
window.addEventListener("hashchange", function() { toggleDetails(); shiftWindow(); });
