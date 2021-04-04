var before = document.getElementById('id-before');
var after = document.getElementById('id-after');
var resultContainer = document.getElementById('id-result-container');
var showPreviewButton = document.getElementById('id-show-preview');

var selectAllButton = document.getElementById('id-select-all');
var deselectAllButton = document.getElementById('id-deselect-all');
var startReplaceButton = document.getElementById('id-start-replace');

var cacheResult = [];

function search() {
  var beforeValue = before.value;
  if (beforeValue) {
    chrome.bookmarks.search(beforeValue, function (res) {
      cacheResult = res.filter(function (item) {
        return item.url.includes(beforeValue);
      });
      renderResult(cacheResult);
    });
  }
}

showPreviewButton.onclick = search;

function templateCell(obj, beforeValue, afterValue) {
  return `<div>
    <input type="checkbox" name="id" value="${obj.id}" /> 
    <div>title: ${obj.title}</div>
    <div>before url: ${obj.url}</div>
    <div>after url: ${obj.url.replace(beforeValue, afterValue)}</div>
  </div>`;
}

function renderResult(res) {
  var beforeValue = before.value;
  var afterValue = after.value;
  var html = res.reduce(function (pre, cur) {
    return pre + templateCell(cur, beforeValue, afterValue);
  }, '');
  resultContainer.innerHTML = html;
}

function selectOrDeselectAllCheckbox(bool) {
  document
    .querySelectorAll('input[type=checkbox][name=id]')
    .forEach(function (item) {
      item.checked = bool;
    });
}

selectAllButton.onclick = function () {
  selectOrDeselectAllCheckbox(true);
};

deselectAllButton.onclick = function () {
  selectOrDeselectAllCheckbox(false);
};

function getChecked() {
  var r = [];
  document
    .querySelectorAll('input[type=checkbox][name=id]')
    .forEach(function (item) {
      if (item.checked === true) {
        r.push(item);
      }
    });
  return r;
}

startReplaceButton.onclick = function () {
  console.log(getChecked());
};
