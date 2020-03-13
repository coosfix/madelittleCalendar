(function () {
    moment.locale('zh-tw')
    function Calendar(slector) {
        this.weeksArray = ['日', '一', '二', '三', '四', '五', '六'];
        this.el = document.querySelector(slector)
        this.today = moment();
        this.firstDay = moment().date(1); //取得這個月開始第一天 
        this.dateCount = 0;
        this.draw();
        this.timeUpdate();//時鐘
    }
    Calendar.prototype.draw = function () {
        this.el.classList.add('claendarMain');
        this.dayOfweek = this.firstDay.day();//取得這個月第一天為星期幾 0~6
        if (!this.tbody) {//如果為點擊下一個或上一個 不重繪這些
            this.drawHeader();
        }
        this.drawMonth();
    };

    Calendar.prototype.drawHeader = function () {
        this.calendarHeader = createEl('div', 'calendarHeader', '');
        this.el.appendChild(this.calendarHeader);
        this.drawHeaderDateTime();
    };

    Calendar.prototype.drawHeaderDateTime = function () {
        var header_scope = createEl('div', 'headerDateTime', '');
        var dateText = createEl('div', 'dateTimetext', this.firstDay.format('YYYY MMM'));
        var next_btn = createEl('div', ['arrow', 'next'], '');
        var self = this;
        next_btn.addEventListener('click', function () {
            self.NextMonth();
        })
        var prev_btn = createEl('div', ['arrow', 'prev'], '');
        prev_btn.addEventListener('click', function () {
            self.PrevMonth();
        })
        header_scope.appendChild(dateText);
        header_scope.appendChild(prev_btn);
        header_scope.appendChild(next_btn);
        this.el.appendChild(header_scope);
    }

    Calendar.prototype.drawMonth = function () {
        var self = this;
        var monthScope = createEl('div', 'calendarMonth', '');
        var table = createEl('table', 'calendar_daytable', '');
        var thead = createEl('thead', '', '');
        var thead_tr = createEl('tr', '', '');
        for (let i = 0; i < this.weeksArray.length; i++) {
            thead_tr.appendChild(createEl('th', '', this.weeksArray[i]));
        }
        thead.appendChild(thead_tr);
        this.tbody = createEl('tbody', ['calendar_daybody', 'fade', this.next_prev ? 'next' : 'prev'], '');
        this.tbody.addEventListener('webkitAnimationEnd', function () {
            this.classList.remove('next', 'prev');
        });

        if (this.oldbody) { // 檢查舊body 開始繪製下一個月份
            self.CheckDayWeek();
            self.drawAllday();
            self.lastCheck();
            this.oldbody.classList.add('fade','out', this.next_prev ? 'next' : 'prev');
            this.oldbody.addEventListener('webkitAnimationEnd', function () {
                self.oldbody.classList.add(self.next_prev ? 'next' : 'prev');
                self.oldbody.parentNode.removeChild(self.oldbody);
                document.querySelector('.calendar_daytable').appendChild(self.tbody);
                self.oldbody = self.tbody;
            });
        } else {
            this.CheckDayWeek();
            this.drawAllday();
            this.lastCheck();
            table.appendChild(thead);
            table.appendChild(this.tbody);
            monthScope.appendChild(table);
            this.el.appendChild(monthScope);
            this.oldbody = this.tbody;
        }
    };
    Calendar.prototype.CheckDayWeek = function () {
        this.weeks = createEl('tr', '', '');
        if (this.dayOfweek !== 0) {
            var clone = this.firstDay.clone().subtract(this.dayOfweek + 1, 'days');
            for (let i = 0; i < this.dayOfweek; i++) {
                this.drawday(clone.add(1, 'days'), 'nextMonth');
            }
        }
    }
    Calendar.prototype.drawAllday = function () {
        var clone = this.firstDay.clone();
        //必須同月
        while (clone.month() === this.firstDay.month()) {
            this.drawday(clone);
            clone.add(1, 'days');
        }
    }
    Calendar.prototype.lastCheck = function () {
        var remainder = 42 - this.dateCount;
        if (remainder) {
            var clone = this.firstDay.clone().endOf('month');//這個月最後一天
            for (let i = 0; i < remainder; i++) {
                this.drawday(clone.add(1, 'days'), 'nextMonth');
            }
        }
        this.dateCount = 0;
    }
    Calendar.prototype.drawday = function (day, classname) {
        var td_day = createEl('td', classname, day.date());
        //if today add css style
        if (day.format('l') === this.today.format('l')) {
            td_day.classList.add('istoday');
        }
        this.weeks.appendChild(td_day);
        if (day.day() === 6) {
            this.weeks = createEl('tr', '', '');
        }
        this.tbody.appendChild(this.weeks);

        this.dateCount++;
    }
    Calendar.prototype.timeUpdate = function () {
        var now = moment();
        this.calendarHeader.innerText = `${now.format('a h:mm:ss')}`;
        if (now.format('MMM') !== document.querySelector('.dateTimetext').textConten) {
            document.querySelector('.dateTimetext').textConten = now.format('MMM');
        }
        setTimeout(this.timeUpdate.bind(this), 1000);
    }
    Calendar.prototype.NextMonth = function () {
        this.firstDay.add(1, 'months');
        this.next_prev = true;
        // var = document.queryselector('.calendar_daytable').p
        document.querySelector('.dateTimetext').textContent = this.firstDay.format('YYYY MMM');

        this.draw();
    }
    Calendar.prototype.PrevMonth = function () {
        this.firstDay.subtract(1, 'months');
        this.next_prev = false;
        document.querySelector('.dateTimetext').textContent = this.firstDay.format('YYYY MMM');
        this.draw();
    }
    function createEl(tagName, className, textConten) {
        var el = document.createElement(tagName);
        if (className) {
            if (Object.prototype.toString.call(className) === '[object Array]') {
                className.forEach(item => { el.classList.add(item); });
            } else {
                el.classList.add(className);
            }
        }
        if (textConten) {
            el.innerText = textConten;
        }
        return el;
    }
    window.Calendar = Calendar;
})();

