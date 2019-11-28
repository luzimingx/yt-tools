var Tool = {
    pattern: /yitang\.dev\.ethercap\.com/,
    currentModeIndex: 0,
    modes: [{
        name: '提测',
        host: 'yitang.dev.ethercap.com',
        class: 'btn-primary'
    }],
    links: [{
        name: 'home',
        url: '/index'
    }, {
        name: '200',
        url: '/promotion/admission'
    }, {
        name: '4000',
        url: '/promotion/financing-acc'
    }, {
        name: '4000占座',
        url: '/promotion/financing-acc-reserve'
    }],
    init: function() {
        var _this = this;
        if (!this.isYitang()) return false;
        this.changeToHttps();
        chrome.storage.sync.get(['developerName'], function(result) {
            if (result.developerName) {
                _this.modes.push({
                    name: '开发',
                    host: result.developerName + '-yitang.dev.ethercap.com',
                    class: 'btn-default'
                });
            }
            _this.addTool();
        });
    },
    isYitang: function() {
        return this.pattern.test(location.origin);
    },
    changeToHttps: function() {
        if (location.protocol.slice(0, -1) === 'https') return true;
        location.href = location.href.replace(/^.*(\:\/\/.+$)/, 'https$1');
    },
    addTool: function() {
        var _this = this;
        var developTol = this.createEl('div', { style: 'position: fixed;z-index: 99;bottom: 2rem;left: 0;border: 1px dotted #eee' });
        // 切换模式
        var modeBtn = this.createEl('button', { class: "btn btn-sm btn-block" });
        this.getCurrentMode();
        modeBtn.classList.add(this.modes[this.currentModeIndex].class);
        modeBtn.innerHTML = '当前模式：' + this.modes[this.currentModeIndex].name;
        modeBtn.addEventListener('click', function() {
            _this.changeMode(modeBtn);
        });
        developTol.appendChild(modeBtn);
        this.links.forEach(function(link) {
            var linkEl = _this.createEl('a', { href: location.origin + link.url, class: 'btn btn-primary btn-sm btn-block', style: 'white-space: nowrap' });
            linkEl.innerHTML = link.name;
            developTol.appendChild(linkEl);
        });
        document.body.appendChild(developTol);
    },
    createEl: function(type, options) {
        var el = document.createElement(type);
        for (var attr in options) {
            el.setAttribute(attr, options[attr]);
        }
        return el;
    },
    getCurrentMode: function() {
        var modes = this.modes,
            currentHost = location.host;
        for (var index = 0, length = modes.length; index < length; index++) {
            if (modes[index].host === currentHost) {
                return this.currentModeIndex = index;
            }
        }
        return false;
    },
    changeMode: function() {
        if (this.modes.length < 2) return;
        var modes = this.modes,
            currentHost = location.host,
            nextIndex = this.currentModeIndex + 1;
        if (nextIndex >= modes.length) this.currentModeIndex = nextIndex = 0;
        location.href = location.href.replace(/^(.*\:\/\/).+?([\?\#\/].*$)/, '$1' + modes[nextIndex].host + '$2');
    }
};

Tool.init();