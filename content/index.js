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
        name: '4000-36kr',
        url: '/promotion/financing-acc-36kr'
    }, {
        name: '4000占座',
        url: '/promotion/financing-acc-reserve'
    }],
    init: function() {
        var _this = this;
        if (!this.isYitang()) return false;
        this.changeToHttps();
        chrome.storage.sync.get(['developerName', 'position'], function(result) {
            if (result.developerName) {
                _this.modes.push({
                    name: '开发',
                    host: result.developerName + '-yitang.dev.ethercap.com',
                    class: 'btn-default'
                });
            }
            _this.addTool(result);
        });
    },
    isYitang: function() {
        return this.pattern.test(location.origin);
    },
    changeToHttps: function() {
        if (location.protocol.slice(0, -1) === 'https') return true;
        location.href = location.href.replace(/^.*(\:\/\/.+$)/, 'https$1');
    },
    addTool: function(data) {
        var _this = this,
            position = data.position ? JSON.parse(data.position) : { x: 0, y: 0 };
        var developTol = this.createEl('div', { style: 'position: fixed;z-index: 99;border: 1px dotted #eee' });
        developTol.style.left = position.x + 'px';
        developTol.style.top = position.y + 'px';
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
        this.addListeners(developTol);
        document.body.parentNode.appendChild(developTol);
    },
    addListeners(developTol) {
        var _this = this,
            positionStart,
            positionMax,
            positionNow = {},
            mouseStart,
            moveFlag = false;
        // 拖动开始
        developTol.addEventListener('touchstart', function(e) {
            positionStart = developTol.getBoundingClientRect();
            positionMax = {
                x: document.documentElement.clientWidth - positionStart.width,
                y: document.documentElement.clientHeight - positionStart.height,
            };
            mouseStart = {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            };
        }, false);
        // 拖动中
        developTol.addEventListener('touchmove', function(e) {
            moveFlag = true;
            e.preventDefault();
            positionNow.x = _this.getPosition(0, positionMax.x, positionStart.x + e.targetTouches[0].pageX - mouseStart.x);
            positionNow.y = _this.getPosition(0, positionMax.y, positionStart.y + e.targetTouches[0].pageY - mouseStart.y);
            developTol.style.left = positionNow.x + 'px';
            developTol.style.top = positionNow.y + 'px';
        }, false);
        // 拖动结束 存储位置
        developTol.addEventListener('touchend', function(e) {
            if (!moveFlag) return;
            chrome.storage.sync.set({
                position: JSON.stringify(positionNow)
            }, function() {
                moveFlag = false;
            });
        }, false);
    },
    getPosition(min, max, current) {
        if (current < min) return min;
        if (current > max) return max;
        return current;
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