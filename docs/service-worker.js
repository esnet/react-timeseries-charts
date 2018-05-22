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
        ["/react-timeseries-charts/index.html", "d286fbd7cd3389589791088e5255240e"],
        [
            "/react-timeseries-charts/static/css/main.5b40b607.css",
            "c24998f8f3b29502d68af2f5aef08ce4"
        ],
        [
            "/react-timeseries-charts/static/media/1_introduction.4b96f9a1.md",
            "4b96f9a198af744d4726c0623277daad"
        ],
        [
            "/react-timeseries-charts/static/media/2_getting_started.906a806a.md",
            "906a806a6639cbe9f39b720ab5eb0707"
        ],
        [
            "/react-timeseries-charts/static/media/3_styling.99c709f2.md",
            "99c709f2b331df1c86d0c6a3792cabc3"
        ],
        [
            "/react-timeseries-charts/static/media/4_annotations.7e00e29b.md",
            "7e00e29b6594529546c573e6bbd09760"
        ],
        [
            "/react-timeseries-charts/static/media/barchart_docs.c7b1c427.md",
            "c7b1c42755607c1edc87bbd8546df9a4"
        ],
        [
            "/react-timeseries-charts/static/media/baselines_docs.af746eac.md",
            "af746eacd139f6ba9c4bc9df7cf19a81"
        ],
        [
            "/react-timeseries-charts/static/media/baselines_thumbnail.ab4808c9.png",
            "ab4808c92b7bf4e147e641fd97a81d5f"
        ],
        [
            "/react-timeseries-charts/static/media/climate_docs.c7298675.md",
            "c72986756e71dbf1d8f91e6c36dcba8e"
        ],
        [
            "/react-timeseries-charts/static/media/continents_docs.219ed683.md",
            "219ed683feb0105737f8ec3651071754"
        ],
        [
            "/react-timeseries-charts/static/media/continents_thumbnail.398a3ca9.png",
            "398a3ca9cf6d95aca9d0710be115c3f9"
        ],
        [
            "/react-timeseries-charts/static/media/currency_docs.eacba985.md",
            "eacba985ff11b30c9a1eb75023768966"
        ],
        [
            "/react-timeseries-charts/static/media/currency_thumbnail.b569b92b.png",
            "b569b92b607af2cd68bb4faa7f97a98a"
        ],
        [
            "/react-timeseries-charts/static/media/cycling_docs.0abc2bf7.md",
            "0abc2bf70755cd21fb7a94232e75c7cc"
        ],
        [
            "/react-timeseries-charts/static/media/cycling_thumbnail.7e08437f.png",
            "7e08437fae558d497f0d83e103e3f85e"
        ],
        [
            "/react-timeseries-charts/static/media/ddos_docs.ef0eb60c.md",
            "ef0eb60cfe8b50c8461079079dcc256b"
        ],
        [
            "/react-timeseries-charts/static/media/ddos_thumbnail.7d2af225.png",
            "7d2af225ef53449d7f9d8b5d0acc8885"
        ],
        [
            "/react-timeseries-charts/static/media/logo.9f83357c.png",
            "9f83357cc7f7b4f7cc1b3c58b74967af"
        ],
        [
            "/react-timeseries-charts/static/media/logo.fe7ba602.png",
            "fe7ba6023d81b125244c54e3eab6f8e5"
        ],
        [
            "/react-timeseries-charts/static/media/nyc_docs.a559ddde.md",
            "a559ddded58f09d611ca8d7fbdee62e6"
        ],
        [
            "/react-timeseries-charts/static/media/nyc_thumbnail.72af0cc8.png",
            "72af0cc87713f1427e459415af93c379"
        ],
        [
            "/react-timeseries-charts/static/media/outages_docs.71f0cb04.md",
            "71f0cb0440905374b392b412cb7b2718"
        ],
        [
            "/react-timeseries-charts/static/media/outages_thumbnail.d50e76c7.png",
            "d50e76c7d0363e53797902c2af985d47"
        ],
        [
            "/react-timeseries-charts/static/media/realtime_docs.c33125e5.md",
            "c33125e55285790967b7a7157460bbea"
        ],
        [
            "/react-timeseries-charts/static/media/realtime_thumbnail.033c51ee.png",
            "033c51eed22b0283906e65f3e28772cf"
        ],
        [
            "/react-timeseries-charts/static/media/traffic_docs.eef1502a.md",
            "eef1502a5349aee1dfc4297db68bcd4d"
        ],
        [
            "/react-timeseries-charts/static/media/traffic_thumbnail.3a9ee161.png",
            "3a9ee161a67b5bdd61d422b05313763b"
        ],
        [
            "/react-timeseries-charts/static/media/volume_docs.0abb4165.md",
            "0abb416598f8dad477d4b42c77ef48de"
        ],
        [
            "/react-timeseries-charts/static/media/volume_thumbnail.2104f5f8.png",
            "2104f5f8856fde38f536ebea25e78f7a"
        ],
        [
            "/react-timeseries-charts/static/media/weather_docs.1ee86e74.md",
            "1ee86e74b8ba6e61ec573cb0bc7d6da2"
        ],
        [
            "/react-timeseries-charts/static/media/weather_thumbnail.f8d6f622.png",
            "f8d6f6222a50f91b78c9e72db1403112"
        ],
        [
            "/react-timeseries-charts/static/media/wind_docs.68aa9567.md",
            "68aa956768312730b31b921d65e42f7b"
        ],
        [
            "/react-timeseries-charts/static/media/wind_thumbnail.1936c918.png",
            "1936c918a90f31b8f2d53cff5e3dff3c"
        ]
    ],
    cacheName =
        "sw-precache-v3-sw-precache-webpack-plugin-" +
        (self.registration ? self.registration.scope : ""),
    ignoreUrlParametersMatching = [/^utm_/],
    addDirectoryIndex = function(e, t) {
        var a = new URL(e);
        return "/" === a.pathname.slice(-1) && (a.pathname += t), a.toString();
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
    createCacheKey = function(e, t, a, c) {
        var s = new URL(e);
        return (
            (c && s.pathname.match(c)) ||
                (s.search +=
                    (s.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(a)),
            s.toString()
        );
    },
    isPathWhitelisted = function(e, t) {
        if (0 === e.length) return !0;
        var a = new URL(t).pathname;
        return e.some(function(e) {
            return a.match(e);
        });
    },
    stripIgnoredUrlParameters = function(e, t) {
        var a = new URL(e);
        return (
            (a.hash = ""),
            (a.search = a.search
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
                .join("&")),
            a.toString()
        );
    },
    hashParamName = "_sw-precache",
    urlsToCacheKeys = new Map(
        precacheConfig.map(function(e) {
            var t = e[0],
                a = e[1],
                c = new URL(t, self.location),
                s = createCacheKey(c, hashParamName, a, /\.\w{8}\./);
            return [c.toString(), s];
        })
    );
self.addEventListener("install", function(e) {
    e.waitUntil(
        caches
            .open(cacheName)
            .then(function(e) {
                return setOfCachedUrls(e).then(function(t) {
                    return Promise.all(
                        Array.from(urlsToCacheKeys.values()).map(function(a) {
                            if (!t.has(a)) {
                                var c = new Request(a, { credentials: "same-origin" });
                                return fetch(c).then(function(t) {
                                    if (!t.ok)
                                        throw new Error(
                                            "Request for " +
                                                a +
                                                " returned a response with status " +
                                                t.status
                                        );
                                    return cleanResponse(t).then(function(t) {
                                        return e.put(a, t);
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
}),
    self.addEventListener("activate", function(e) {
        var t = new Set(urlsToCacheKeys.values());
        e.waitUntil(
            caches
                .open(cacheName)
                .then(function(e) {
                    return e.keys().then(function(a) {
                        return Promise.all(
                            a.map(function(a) {
                                if (!t.has(a.url)) return e.delete(a);
                            })
                        );
                    });
                })
                .then(function() {
                    return self.clients.claim();
                })
        );
    }),
    self.addEventListener("fetch", function(e) {
        if ("GET" === e.request.method) {
            var t,
                a = stripIgnoredUrlParameters(e.request.url, ignoreUrlParametersMatching);
            (t = urlsToCacheKeys.has(a)) ||
                ((a = addDirectoryIndex(a, "index.html")), (t = urlsToCacheKeys.has(a)));
            !t &&
                "navigate" === e.request.mode &&
                isPathWhitelisted(["^(?!\\/__).*"], e.request.url) &&
                ((a = new URL("/react-timeseries-charts/index.html", self.location).toString()),
                (t = urlsToCacheKeys.has(a))),
                t &&
                    e.respondWith(
                        caches
                            .open(cacheName)
                            .then(function(e) {
                                return e.match(urlsToCacheKeys.get(a)).then(function(e) {
                                    if (e) return e;
                                    throw Error(
                                        "The cached response that was expected is missing."
                                    );
                                });
                            })
                            .catch(function(t) {
                                return (
                                    console.warn(
                                        'Couldn\'t serve response for "%s" from cache: %O',
                                        e.request.url,
                                        t
                                    ),
                                    fetch(e.request)
                                );
                            })
                    );
        }
    });
