"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var moment = require("moment");
function repeatZero(qty) {
    "0".repeat(qty);
}
function padZero(str, len, isRight) {
    if (isRight === void 0) { isRight = false; }
    if (str == null) {
        str = "";
    }
    str = "" + str;
    return (isRight ? str : "") + repeatZero(len - str.length) + (isRight ? "" : str);
}
function pluck(array, prop) {
    return _.map(array, function (item) {
        return item[prop];
    });
}
function compact(array) {
    var ret = [];
    _.each(array, function (item) {
        if (item) {
            ret.push(item);
        }
    });
    return ret;
}
function unique(array) {
    var ret = [];
    _.each(array, function (_a) {
        if (!find(ret, _a)) {
            ret.push(_a);
        }
    });
    return ret;
}
function intersection(a, b) {
    var ret = [];
    _.each(a, function (_a) {
        _.each(b, function (_b) {
            if (_a === _b) {
                ret.push(_a);
            }
        });
    });
    return unique(ret);
}
function rest(array, callback) {
    for (var _i = 0, _c = array.entries(); _i < _c.length; _i++) {
        var _d = _c[_i], index = _d[0], item = _d[1];
        if (!callback(item)) {
            return array.slice(index);
        }
    }
    return array;
}
function initial(array, callback) {
    var reversed = array.slice().reverse();
    return rest(reversed, callback).reverse();
}
function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}
function findLast(array, callback) {
    var index = array.length;
    while ((index -= 1)) {
        if (callback(array[index])) {
            return array[index];
        }
    }
}
function find(array, callback) {
    var index = 0, max = array.length, match;
    if (typeof callback !== "function") {
        match = callback;
        callback = function (item) {
            return item === match;
        };
    }
    while (index < max) {
        if (callback(array[index])) {
            return array[index];
        }
        index += 1;
    }
}
var defaults = {
    escape: /\[(.+?)\]/,
    years: /[Yy]+/,
    months: /M+/,
    weeks: /[Ww]+/,
    days: /[Dd]+/,
    hours: /[Hh]+/,
    minutes: /m+/,
    seconds: /s+/,
    milliseconds: /S+/,
    general: /.+?/,
    types: "escape years months weeks days hours minutes seconds milliseconds general",
    trim: "left",
    precision: 0,
    forceLength: null,
    template: function () {
        var settings = this;
        var types = settings.types;
        var lastType = findLast(types, function (type) {
            return settings.duration._data[type];
        });
        switch (lastType) {
            case "seconds":
                return "h:mm:ss";
            case "minutes":
                return "d[d] h:mm";
            case "hours":
                return "d[d] h[h]";
            case "days":
                return "M[m] d[d]";
            case "weeks":
                return "y[y] w[w]";
            case "months":
                return "y[y] M[m]";
            case "years":
                return "y[y]";
            default:
                return "y[y] M[m] d[d] h:mm:ss";
        }
    }
};
function default_1(duration, template, precision) {
    var tokenizer;
    var tokens;
    var types;
    var typeMap;
    var momentTypes;
    var foundFirst;
    var settings = extend({}, defaults);
    var remainder = moment.duration(duration);
    settings.duration = duration;
    if (template) {
        settings.template = template;
    }
    if (precision) {
        settings.precision = precision;
    }
    types = settings.types = _.isArray(settings.types) ? settings.types : settings.types.split(" ");
    if (_.isFunction(settings.template)) {
        settings.template = settings.template.apply(settings);
    }
    tokenizer = new RegExp(_.map(types, function (type) { return settings[type].source; }).join("|"), "g");
    typeMap = function (token) {
        return find(types, function (type) {
            return settings[type].test(token);
        });
    };
    tokens = _.map(settings.template.match(tokenizer), function (token, index) {
        var type = typeMap(token);
        var length = token.length;
        return {
            index: index,
            length: length,
            token: type === "escape" ? token.replace(settings.escape, "$1") : token,
            type: type === "escape" || type === "general" ? null : type
        };
    });
    momentTypes = intersection(types, unique(compact(pluck(tokens, "type"))));
    if (!momentTypes.length) {
        return pluck(tokens, "token").join("");
    }
    _.each(momentTypes, function (momentType, index) {
        var value, wholeValue, decimalValue, isLeast, isMost;
        value = remainder.as(momentType);
        wholeValue = value > 0 ? Math.floor(value) : Math.ceil(value);
        decimalValue = value - wholeValue;
        isLeast = index + 1 === momentTypes.length;
        isMost = !index;
        _.each(tokens, function (token) {
            if (token.type === momentType) {
                extend(token, {
                    value: value,
                    wholeValue: wholeValue,
                    decimalValue: decimalValue,
                    isLeast: isLeast,
                    isMost: isMost
                });
                if (isMost) {
                    if (settings.forceLength == null && token.length > 1) {
                        settings.forceLength = true;
                    }
                }
            }
        });
        remainder.subtract(wholeValue, momentType);
    });
    if (settings.trim) {
        tokens = (settings.trim === "left" ? rest : initial)(tokens, function (token) {
            return !(token.isLeast || (token.type != null && token.wholeValue));
        });
    }
    foundFirst = false;
    if (settings.trim === "right") {
        tokens.reverse();
    }
    tokens = _.map(tokens, function (token) {
        var val;
        var decVal;
        if (!token.type) {
            return token.token;
        }
        if (token.isLeast && settings.precision < 0) {
            val = (Math.floor(token.wholeValue * Math.pow(10, settings.precision)) *
                Math.pow(10, -settings.precision)).toString();
        }
        else {
            val = token.wholeValue.toString();
        }
        val = val.replace(/^\-/, "");
        if (token.length > 1 && (foundFirst || token.isMost || settings.forceLength)) {
            val = padZero(val, token.length);
        }
        if (token.isLeast && settings.precision > 0) {
            decVal = token.decimalValue
                .toString()
                .replace(/^\-/, "")
                .split(/\.|e\-/);
            switch (decVal.length) {
                case 1:
                    val +=
                        "." +
                            padZero(decVal[0], settings.precision, true).slice(0, settings.precision);
                    break;
                case 2:
                    val +=
                        "." +
                            padZero(decVal[1], settings.precision, true).slice(0, settings.precision);
                    break;
                case 3:
                    val +=
                        "." +
                            padZero(repeatZero(+decVal[2] - 1) + (decVal[0] || "0") + decVal[1], settings.precision, true).slice(0, settings.precision);
                    break;
                default:
                    throw new Error("Moment Duration Format: unable to parse token decimal value.");
            }
        }
        if (token.isMost && token.value < 0) {
            val = "-" + val;
        }
        foundFirst = true;
        return val;
    });
    if (settings.trim === "right") {
        tokens.reverse();
    }
    return tokens.join("");
}
exports.default = default_1;
//# sourceMappingURL=duration.js.map