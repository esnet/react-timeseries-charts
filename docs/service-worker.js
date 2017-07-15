"use strict";
function setOfCachedUrls(e) {
    return e
        .keys()
        .then(function(e) {
            return e.map(function(e) {
                return e.url;
            });
        })
        .then(function(e) {
            return new Set(e);
        });
}
var precacheConfig = [
    ["/react-timeseries-charts/index.html", "cc23c070e5d01a2ecf34ec8261830844"],
    ["/react-timeseries-charts/static/css/main.7fea2283.css", "b40da45b07d9f6ee7cd3b2edd17973eb"],
    ["/react-timeseries-charts/static/js/main.a3cb08ce.js", "0fc025c44fec764a4ee32de951ac7e6e"],
    [
        "/react-timeseries-charts/static/media/charts.9f83357c.png",
        "9f83357cc7f7b4f7cc1b3c58b74967af"
    ],
    ["/react-timeseries-charts/static/media/intro.0e4d48e2.md", "0e4d48e268cebbab4c1ecbce828c489b"],
    ["/react-timeseries-charts/static/media/logo.fe7ba602.png", "fe7ba6023d81b125244c54e3eab6f8e5"]
],
    cacheName = "sw-precache-v3-sw-precache-webpack-plugin-" +
        (self.registration ? self.registration.scope : ""),
    ignoreUrlParametersMatching = [/^utm_/],
    addDirectoryIndex = function(e, t) {
        var r = new URL(e);
        return "/" === r.pathname.slice(-1) && (r.pathname += t), r.toString();
    },
    cleanResponse = function(e) {
        return e.redirected
            ? ("body" in e ? Promise.resolve(e.body) : e.blob()).then(function(t) {
                  return new Response(t, {
                      headers: e.headers,
                      status: e.status,
                      statusText: e.statusText
                  });
              })
            : Promise.resolve(e);
    },
    createCacheKey = function(e, t, r, n) {
        var a = new URL(e);
        return (n && a.pathname.match(n)) ||
            (a.search += (a.search ? "&" : "") +
                encodeURIComponent(t) +
                "=" +
                encodeURIComponent(r)), a.toString();
    },
    isPathWhitelisted = function(e, t) {
        if (0 === e.length) return !0;
        var r = new URL(t).pathname;
        return e.some(function(e) {
            return r.match(e);
        });
    },
    stripIgnoredUrlParameters = function(e, t) {
        var r = new URL(e);
        return (r.hash = ""), (r.search = r.search
            .slice(1)
            .split("&")
            .map(function(e) {
                return e.split("=");
            })
            .filter(function(e) {
                return t.every(function(t) {
                    return !t.test(e[0]);
                });
            })
            .map(function(e) {
                return e.join("=");
            })
            .join("&")), r.toString();
    },
    hashParamName = "_sw-precache",
    urlsToCacheKeys = new Map(
        precacheConfig.map(function(e) {
            var t = e[0],
                r = e[1],
                n = new URL(t, self.location),
                a = createCacheKey(n, hashParamName, r, /\.\w{8}\./);
            return [n.toString(), a];
        })
    );
self.addEventListener("install", function(e) {
    e.waitUntil(
        caches
            .open(cacheName)
            .then(function(e) {
                return setOfCachedUrls(e).then(function(t) {
                    return Promise.all(
                        Array.from(urlsToCacheKeys.values()).map(function(r) {
                            if (!t.has(r)) {
                                var n = new Request(r, { credentials: "same-origin" });
                                return fetch(n).then(function(t) {
                                    if (!t.ok)
                                        throw new Error(
                                            "Request for " +
                                                r +
                                                " returned a response with status " +
                                                t.status
                                        );
                                    return cleanResponse(t).then(function(t) {
                                        return e.put(r, t);
                                    });
                                });
                            }
                        })
                    );
                });
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
}), self.addEventListener("activate", function(e) {
    var t = new Set(urlsToCacheKeys.values());
    e.waitUntil(
        caches
            .open(cacheName)
            .then(function(e) {
                return e.keys().then(function(r) {
                    return Promise.all(
                        r.map(function(r) {
                            if (!t.has(r.url)) return e.delete(r);
                        })
                    );
                });
            })
            .then(function() {
                return self.clients.claim();
            })
    );
}), self.addEventListener("fetch", function(e) {
    if ("GET" === e.request.method) {
        var t, r = stripIgnoredUrlParameters(e.request.url, ignoreUrlParametersMatching);
        (t = urlsToCacheKeys.has(r)) ||
            ((r = addDirectoryIndex(r, "index.html")), (t = urlsToCacheKeys.has(r)));
        !t &&
            "navigate" === e.request.mode &&
            isPathWhitelisted(["^(?!\\/__).*"], e.request.url) &&
            ((r = new URL(
                "/react-timeseries-charts/index.html",
                self.location
            ).toString()), (t = urlsToCacheKeys.has(r))), t &&
            e.respondWith(
                caches
                    .open(cacheName)
                    .then(function(e) {
                        return e.match(urlsToCacheKeys.get(r)).then(function(e) {
                            if (e) return e;
                            throw Error("The cached response that was expected is missing.");
                        });
                    })
                    .catch(function(t) {
                        return console.warn(
                            'Couldn\'t serve response for "%s" from cache: %O',
                            e.request.url,
                            t
                        ), fetch(e.request);
                    })
            );
    }
});
