// Generated by tsc.
// source: cockroach/resource/us/ts/...
// DO NOT EDIT!
//
// Copyright 2015 The Cockroach Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License. See the AUTHORS file
// for names of contributors.
//
// Authors: Bram Gruneir (bramgruneir@gmail.com)
//		    Andrew Bonventre (andybons@gmail.com)
//		    Matt Tracy (matt@cockroachlabs.com)
//
var headerDescription = 'This file is designed to add the header to the top of the combined js file.';
// source: controllers/rest_explorer.ts
/// <reference path="../typings/mithriljs/mithril.d.ts" />
var AdminViews;
(function (AdminViews) {
    var RestExplorer;
    (function (RestExplorer) {
        var Model;
        (function (Model) {
            Model.singleKey = m.prop("");
            Model.singleValue = m.prop("");
            Model.singleCounter = m.prop(0);
            Model.rangeStart = m.prop("");
            Model.rangeEnd = m.prop("");
            Model.responseLog = m.prop([]);
            function logResponse(xhr, opts) {
                var data;
                if (xhr.responseType === "json") {
                    data = JSON.stringify(xhr.response);
                }
                else {
                    data = xhr.responseText;
                }
                data = data.length > 0 ? data : "(no response body)";
                data = ['[', opts.method, '] ', xhr.status, ' ', opts.url, ': ', data].join('');
                Model.responseLog().push(data);
                return JSON.stringify(data);
            }
            function scan(method) {
                var endpoint = "/kv/rest/range?start=" + encodeURIComponent(Model.rangeStart());
                if (!!Model.rangeEnd()) {
                    endpoint += '&end=' + encodeURIComponent(Model.rangeEnd());
                }
                return m.request({
                    method: method,
                    url: endpoint,
                    extract: logResponse,
                });
            }
            Model.scan = scan;
            function entry(method) {
                var endpoint = "/kv/rest/entry/" + Model.singleKey();
                var request = {
                    method: method,
                    url: endpoint,
                    extract: logResponse,
                    serialize: function (data) { return data; },
                };
                if (method === "POST") {
                    request.config = function (xhr, opts) {
                        xhr.setRequestHeader("Content-Type", "text/plain; charset=UTF-8");
                        return xhr;
                    };
                    request.data = Model.singleValue();
                }
                return m.request(request);
            }
            Model.entry = entry;
            function counter(method) {
                var endpoint = "/kv/rest/counter/" + Model.singleKey();
                var request = {
                    method: method,
                    url: endpoint,
                    extract: logResponse,
                    serialize: function (data) { return data; },
                };
                if (method === "POST") {
                    request.config = function (xhr, opts) {
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                        return xhr;
                    };
                    request.data = Model.singleCounter();
                }
                return m.request(request);
            }
            Model.counter = counter;
            function clearLog() {
                Model.responseLog([]);
            }
            Model.clearLog = clearLog;
            ;
        })(Model || (Model = {}));
        function button(text, onclick, disabled) {
            return m("input[type=button]", {
                value: text,
                disabled: disabled(),
                onclick: onclick,
            });
        }
        function field(text, value, disabled) {
            return m("input[type=text]", {
                placeholder: text,
                disabled: disabled(),
                value: value(),
                onchange: m.withAttr("value", value),
            });
        }
        var EntryComponent;
        (function (EntryComponent) {
            var Controller = (function () {
                function Controller() {
                    var _this = this;
                    this.responsePending = m.prop(false);
                    this.key = Model.singleKey;
                    this.val = Model.singleValue;
                    this.complete = function () { return _this.responsePending(false); };
                    this.get = function () { return _this.request("GET"); };
                    this.post = function () { return _this.request("POST"); };
                    this.head = function () { return _this.request("HEAD"); };
                    this.delete = function () { return _this.request("DELETE"); };
                }
                Controller.prototype.request = function (method) {
                    this.responsePending(true);
                    Model.entry(method).then(this.complete, this.complete);
                };
                return Controller;
            })();
            function controller() {
                return new Controller();
            }
            EntryComponent.controller = controller;
            function view(ctrl) {
                return m("section.restExplorerControls-control", [
                    m("h3", "K/V Pair"),
                    m("form", [
                        field("Key", ctrl.key, ctrl.responsePending),
                        m.trust("&rarr;"),
                        field("Value", ctrl.val, ctrl.responsePending),
                        button("Get", ctrl.get, ctrl.responsePending),
                        button("Head", ctrl.head, ctrl.responsePending),
                        button("Put", ctrl.post, ctrl.responsePending),
                        button("Delete", ctrl.delete, ctrl.responsePending),
                    ])
                ]);
            }
            EntryComponent.view = view;
        })(EntryComponent || (EntryComponent = {}));
        var RangeComponent;
        (function (RangeComponent) {
            var Controller = (function () {
                function Controller() {
                    var _this = this;
                    this.responsePending = m.prop(false);
                    this.rangeStart = Model.rangeStart;
                    this.rangeEnd = Model.rangeEnd;
                    this.complete = function () { return _this.responsePending(false); };
                    this.get = function () { return _this.request("GET"); };
                    this.delete = function () { return _this.request("DELETE"); };
                }
                Controller.prototype.request = function (method) {
                    this.responsePending(true);
                    Model.scan(method).then(this.complete, this.complete);
                };
                return Controller;
            })();
            function controller() {
                return new Controller();
            }
            RangeComponent.controller = controller;
            function view(ctrl) {
                return m("section.restExplorerControls-control", [
                    m("h3", "Range"),
                    m("form", [
                        field("Start", ctrl.rangeStart, ctrl.responsePending),
                        m.trust("&rarr;"),
                        field("End", ctrl.rangeEnd, ctrl.responsePending),
                        button("Get", ctrl.get, ctrl.responsePending),
                        button("Delete", ctrl.delete, ctrl.responsePending),
                    ])
                ]);
            }
            RangeComponent.view = view;
        })(RangeComponent || (RangeComponent = {}));
        var CounterComponent;
        (function (CounterComponent) {
            var Controller = (function () {
                function Controller() {
                    var _this = this;
                    this.responsePending = m.prop(false);
                    this.key = Model.singleKey;
                    this.val = Model.singleCounter;
                    this.complete = function () { return _this.responsePending(false); };
                    this.get = function () { return _this.request("GET"); };
                    this.post = function () { return _this.request("POST"); };
                    this.head = function () { return _this.request("HEAD"); };
                    this.delete = function () { return _this.request("DELETE"); };
                }
                Controller.prototype.request = function (method) {
                    this.responsePending(true);
                    Model.counter(method).then(this.complete, this.complete);
                };
                return Controller;
            })();
            function controller() {
                return new Controller();
            }
            CounterComponent.controller = controller;
            function view(ctrl) {
                return m("section.restExplorerControls-control", [
                    m("h3", "Counter"),
                    m("form", [
                        field("Key", ctrl.key, ctrl.responsePending),
                        m.trust("&rarr;"),
                        field("Value", ctrl.val, ctrl.responsePending),
                        button("Get", ctrl.get, ctrl.responsePending),
                        button("Head", ctrl.head, ctrl.responsePending),
                        button("Put", ctrl.post, ctrl.responsePending),
                        button("Delete", ctrl.delete, ctrl.responsePending),
                    ])
                ]);
            }
            CounterComponent.view = view;
        })(CounterComponent || (CounterComponent = {}));
        var LogComponent;
        (function (LogComponent) {
            function controller() {
                return {
                    log: Model.responseLog,
                    clear: Model.clearLog,
                };
            }
            LogComponent.controller = controller;
            function view(ctrl) {
                return m(".restExplorerLog", [
                    m("h3", "Console"),
                    button("Clear", ctrl.clear, function () { return false; }),
                    ctrl.log().map(function (str) {
                        return m("", str);
                    })
                ]);
            }
            LogComponent.view = view;
        })(LogComponent || (LogComponent = {}));
        var Page;
        (function (Page) {
            function controller() { }
            Page.controller = controller;
            function view() {
                return m(".restExplorer", [
                    m(".restExplorerControls", [
                        EntryComponent,
                        RangeComponent,
                        CounterComponent,
                    ]),
                    LogComponent,
                ]);
            }
            Page.view = view;
        })(Page = RestExplorer.Page || (RestExplorer.Page = {}));
    })(RestExplorer = AdminViews.RestExplorer || (AdminViews.RestExplorer = {}));
})(AdminViews || (AdminViews = {}));
// source: controllers/monitor.ts
/// <reference path="../typings/mithriljs/mithril.d.ts" />
var AdminViews;
(function (AdminViews) {
    var Monitor;
    (function (Monitor) {
        var Page;
        (function (Page) {
            function controller() { }
            Page.controller = controller;
            function view() {
                return m("h3", "Monitor Placeholder");
            }
            Page.view = view;
        })(Page = Monitor.Page || (Monitor.Page = {}));
    })(Monitor = AdminViews.Monitor || (AdminViews.Monitor = {}));
})(AdminViews || (AdminViews = {}));
// source: models/timeseries.ts
/// <reference path="../typings/mithriljs/mithril.d.ts" />
// Author: Matt Tracy (matt@cockroachlabs.com)
var Models;
(function (Models) {
    var Metrics;
    (function (Metrics) {
        function query(start, end, series) {
            var url = "/ts/query";
            var data = {
                start_nanos: start.getTime() * 1.0e6,
                end_nanos: end.getTime() * 1.0e6,
                queries: series.map(function (r) { return { name: r }; }),
            };
            return m.request({ url: url, method: "POST", extract: nonJsonErrors, data: data })
                .then(function (d) {
                if (!d.results) {
                    d.results = [];
                }
                d.results.forEach(function (r) {
                    if (!r.datapoints) {
                        r.datapoints = [];
                    }
                });
                return d;
            });
        }
        var StaticQuery = (function () {
            function StaticQuery(start, end) {
                var series = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    series[_i - 2] = arguments[_i];
                }
                this.start = start;
                this.end = end;
                this.series = series;
            }
            StaticQuery.prototype.query = function () {
                if (this.data != null) {
                    return this.data;
                }
                this.data = query(this.start, this.end, this.series);
                return this.data;
            };
            return StaticQuery;
        })();
        Metrics.StaticQuery = StaticQuery;
        var SlidingQuery = (function () {
            function SlidingQuery(windowDuration) {
                var series = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    series[_i - 1] = arguments[_i];
                }
                this.windowDuration = windowDuration;
                this.series = series;
            }
            SlidingQuery.prototype.query = function () {
                var endTime = new Date();
                var startTime = new Date(endTime.getTime() - this.windowDuration);
                return query(startTime, endTime, this.series);
            };
            return SlidingQuery;
        })();
        Metrics.SlidingQuery = SlidingQuery;
        function nonJsonErrors(xhr, opts) {
            return xhr.status > 200 ? JSON.stringify(xhr.responseText) : xhr.responseText;
        }
    })(Metrics = Models.Metrics || (Models.Metrics = {}));
})(Models || (Models = {}));
// source: components/metrics.ts
/// <reference path="../typings/mithriljs/mithril.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../models/timeseries.ts" />
var Components;
(function (Components) {
    var Metrics;
    (function (Metrics) {
        var LineGraph;
        (function (LineGraph) {
            var Controller = (function () {
                function Controller(vm) {
                    var _this = this;
                    this.vm = vm;
                    this.data = m.prop(null);
                    this.error = m.prop(null);
                    this.chart = nv.models.lineChart()
                        .x(function (d) { return new Date(d.timestamp_nanos / 1.0e6); })
                        .y(function (d) { return d.value; })
                        .useInteractiveGuideline(true)
                        .showLegend(true)
                        .showYAxis(true)
                        .showXAxis(true)
                        .xScale(d3.time.scale());
                    this.drawGraph = function (element, isInitialized, context) {
                        if (!isInitialized) {
                            var interval = setInterval(function () { return _this.queryData(); }, 10000);
                            context.onunload = function () {
                                clearInterval(interval);
                            };
                            nv.addGraph(_this.chart);
                        }
                        if (_this.readData()) {
                            var formattedData = _this.data().results.map(function (d) {
                                return {
                                    values: d.datapoints,
                                    key: d.name,
                                    color: Controller.colors(d.name),
                                    area: true,
                                    fillOpacity: .1,
                                };
                            });
                            d3.select(element)
                                .datum(formattedData)
                                .transition().duration(500)
                                .call(_this.chart);
                        }
                    };
                    this.queryData();
                    this.chart.xAxis
                        .tickFormat(d3.time.format('%I:%M:%S'))
                        .showMaxMin(false);
                }
                Controller.prototype.queryData = function () {
                    if (this.activeQuery) {
                        return;
                    }
                    this.error(null);
                    this.activeQuery = this.vm.query.query().then(null, this.error);
                };
                Controller.prototype.readData = function () {
                    if (this.activeQuery && this.activeQuery()) {
                        this.data(this.activeQuery());
                        this.activeQuery = null;
                        return true;
                    }
                    return false;
                };
                Controller.prototype.hasData = function () {
                    return !!this.data() || (this.activeQuery && !!this.activeQuery());
                };
                Controller.colors = d3.scale.category10();
                return Controller;
            })();
            function controller(model) {
                return new Controller(model);
            }
            LineGraph.controller = controller;
            function view(ctrl) {
                if (ctrl.error()) {
                    return m("", "error loading graph:" + ctrl.error());
                }
                else if (ctrl.hasData()) {
                    return m(".linegraph", { style: "width:500px;height:300px;" }, m("svg.graph", { config: ctrl.drawGraph }));
                }
                else {
                    return m("", "loading...");
                }
            }
            LineGraph.view = view;
            function create(width, height, query, key) {
                var vm = { width: width, height: height, lastVersion: 0, query: query };
                if (key) {
                    vm.key = key;
                }
                return m.component(LineGraph, vm);
            }
            LineGraph.create = create;
        })(LineGraph = Metrics.LineGraph || (Metrics.LineGraph = {}));
    })(Metrics = Components.Metrics || (Components.Metrics = {}));
})(Components || (Components = {}));
// source: controllers/monitor.ts
/// <reference path="../typings/mithriljs/mithril.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="../models/timeseries.ts" />
/// <reference path="../components/metrics.ts" />
var AdminViews;
(function (AdminViews) {
    var Graph;
    (function (Graph) {
        var Page;
        (function (Page) {
            function controller() { }
            Page.controller = controller;
            function view() {
                var windowSize = 10 * 60 * 1000;
                return m(".graphPage", [
                    m("H3", "Graph Demo"),
                    Components.Metrics.LineGraph.create(500, 350, new Models.Metrics.SlidingQuery(windowSize, "cr.store.livebytes.1")),
                    Components.Metrics.LineGraph.create(500, 350, new Models.Metrics.SlidingQuery(windowSize, "cr.store.keybytes.1")),
                    Components.Metrics.LineGraph.create(500, 350, new Models.Metrics.SlidingQuery(windowSize, "cr.store.livebytes.1", "cr.store.valbytes.1")),
                ]);
            }
            Page.view = view;
        })(Page = Graph.Page || (Graph.Page = {}));
    })(Graph = AdminViews.Graph || (AdminViews.Graph = {}));
})(AdminViews || (AdminViews = {}));
// source: app.ts
/// <reference path="typings/mithriljs/mithril.d.ts" />
/// <reference path="pages/rest_explorer.ts" />
/// <reference path="pages/monitor.ts" />
/// <reference path="pages/graph.ts" />
m.route.mode = "hash";
m.route(document.getElementById("root"), "/rest-explorer", {
    "/rest-explorer": AdminViews.RestExplorer.Page,
    "/monitor": AdminViews.Monitor.Page,
    "/graph": AdminViews.Graph.Page,
});
