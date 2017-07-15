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
    ["/react-timeseries-charts/index.html", "deee5b9c2cb4543eab8a9f8bb9554ded"],
    ["/react-timeseries-charts/static/css/main.7fea2283.css", "b40da45b07d9f6ee7cd3b2edd17973eb"],
    ["/react-timeseries-charts/static/js/main.2e0bb8cf.js", "70b6b55e1149a88c9c9d80934a6a3913"],
    [
        "/react-timeseries-charts/static/media/1_introduction.0eb6f1ed.md",
        "0eb6f1ed106ac6275a5aa0c37d2dbb36"
    ],
    [
        "/react-timeseries-charts/static/media/2_getting_started.e976c36b.md",
        "e976c36bf37dd127a6bc173fcd6a6c3a"
    ],
    [
        "/react-timeseries-charts/static/media/3_styling.99c709f2.md",
        "99c709f2b331df1c86d0c6a3792cabc3"
    ],
    [
        "/react-timeseries-charts/static/media/4_annotations.15e6975b.md",
        "15e6975ba0646f3b71915e5d4326e354"
    ],
    [
        "/react-timeseries-charts/static/media/barchart_docs.387e58bc.md",
        "387e58bc4edb949f3aca1aa1aaa89820"
    ],
    [
        "/react-timeseries-charts/static/media/charts.9f83357c.png",
        "9f83357cc7f7b4f7cc1b3c58b74967af"
    ],
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
    createCacheKey = function(e, t, r, a) {
        var n = new URL(e);
        return (a && n.pathname.match(a)) ||
            (n.search += (n.search ? "&" : "") +
                encodeURIComponent(t) +
                "=" +
                encodeURIComponent(r)), n.toString();
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
                a = new URL(t, self.location),
                n = createCacheKey(a, hashParamName, r, /\.\w{8}\./);
            return [a.toString(), n];
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
                                var a = new Request(r, { credentials: "same-origin" });
                                return fetch(a).then(function(t) {
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
