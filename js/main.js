var before = document.getElementById('id-before');
var after = document.getElementById('id-after');
var resultContainer = document.getElementById('id-result-container');
var showPreviewButton = document.getElementById('id-show-preview');

var selectAllButton = document.getElementById('id-select-all');
var deselectAllButton = document.getElementById('id-deselect-all');
var startReplaceButton = document.getElementById('id-start-replace');

var cacheResult = [];
var willChangeMap = {};

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

function highlight(url, word) {
  if (!word) {
    return url;
  }
  var arr = url.split(word);
  var j = `<span class="highlight">${word}</span>`;
  var r = arr.join(j);
  return r;
}

function templateCell(obj, beforeValue, afterValue) {
  var afterURL = obj.url.replace(new RegExp(beforeValue, 'gm'), afterValue);
  willChangeMap[obj.id] = afterURL;
  return `<div>
    <input type="checkbox" name="id" value="${obj.id}" /> 
    <div>title: ${obj.title}</div>
    <div>before url: ${highlight(obj.url, beforeValue)}</div>
    <div>after url: ${highlight(afterURL, afterValue)}</div>
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
  return document.querySelectorAll('input[type="checkbox"]:checked');
}

startReplaceButton.onclick = function () {
  var checked = getChecked();
  if (!checked.length) {
    alert('please select at least one');
  } else if (confirm('confirm replace?')) {
    var checkedId = Array.prototype.map.call(checked, function (item) {
      return item.value;
    });
    checkedId.forEach(function (id) {
      chrome.bookmarks.update(id, { url: willChangeMap[id] });
    });
    alert('success!');
  }
};
