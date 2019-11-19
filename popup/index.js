function $(selector) {
    return document.querySelector(selector);
}
var Index = {
    dom: {
        developerName: $('.developer-name'),
        confirmBtn: $('.btn-confirm')
    },
    init: function() {
        var _this = this;
        chrome.storage.sync.get(['developerName'], function(result) {
            _this.dom.developerName.value = result.developerName || '';
        });
        this.addListeners();
    },
    addListeners: function() {
        var _this = this;
        this.dom.confirmBtn.addEventListener('click', function() {
            chrome.storage.sync.set({
                developerName: _this.dom.developerName.value
            }, function() {
                window.close();
            });
        });
    }
};

Index.init();