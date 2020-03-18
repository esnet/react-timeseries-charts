import * as _ from "lodash";
import * as moment from "moment";

/**
 */

/**
 * returns "0" repeated qty times
 */
function repeatZero(qty: number) {
    "0".repeat(qty);
}

/**
 * pads a string with zeros up to a specified length
 * greater than or equal to the specified length
 * default output pads with zeros on the left
 * set isRight to `true` to pad with zeros on the right
 */
function padZero(str: string, len: number, isRight: boolean = false) {
    if (str == null) {
        str = "";
    }
    str = "" + str;
    return (isRight ? str : "") + repeatZero(len - str.length) + (isRight ? "" : str);
}

// pluck
function pluck(array, prop) {
    return _.map(array, function(item) {
        return item[prop];
    });
}

// compact
function compact(array) {
    var ret = [];

    _.each(array, function(item) {
        if (item) {
            ret.push(item);
        }
    });

    return ret;
}

// unique
function unique(array) {
    var ret = [];

    _.each(array, function(_a) {
        if (!find(ret, _a)) {
            ret.push(_a);
        }
    });

    return ret;
}

// intersection
function intersection(a, b) {
    var ret = [];

    _.each(a, function(_a) {
        _.each(b, function(_b) {
            if (_a === _b) {
                ret.push(_a);
            }
        });
    });

    return unique(ret);
}

// rest
function rest(array, callback) {
    for (let [index, item] of array.entries()) {
        if (!callback(item)) {
            return array.slice(index);
        }
    }
    return array;
}

// initial
function initial(array, callback) {
    var reversed = array.slice().reverse();
    return rest(reversed, callback).reverse();
}

// extend
function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }

    return a;
}

// findLast
function findLast(array, callback) {
    let index = array.length;

    while ((index -= 1)) {
        if (callback(array[index])) {
            return array[index];
        }
    }
}

// find
function find(array, callback) {
    var index = 0,
        max = array.length,
        match;

    if (typeof callback !== "function") {
        match = callback;
        callback = function(item) {
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

const defaults = {
    // token definitions
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

    // token type names
    // in order of descending magnitude
    // can be a space-separated token name list or an array of token names
    types: "escape years months weeks days hours minutes seconds milliseconds general",

    // format options

    // trim
    // "left" - template tokens are trimmed from the left until the first moment token that has a value >= 1
    // "right" - template tokens are trimmed from the right until the first moment token that has a value >= 1
    // (the final moment token is not trimmed, regardless of value)
    // `false` - template tokens are not trimmed
    trim: "left",

    // precision
    // number of decimal digits to include after (to the right of) the decimal point (positive integer)
    // or the number of digits to truncate to 0 before (to the left of) the decimal point (negative integer)
    precision: 0,

    // force first moment token with a value to render at full length even when template is trimmed and first moment token has length of 1
    forceLength: null,

    // template used to format duration
    // may be a function or a string
    // template functions are executed with the `this` binding of the settings object
    // so that template strings may be dynamically generated based on the duration object
    // (accessible via `this.duration`)
    // or any of the other settings
    template() {
        const settings = this;
        const types = settings.types;
        const lastType = findLast(types, type => {
            return settings.duration._data[type];
        });

        // default template strings for each duration dimension type
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

export default function(duration, template?, precision?) {
    let tokenizer;
    let tokens;
    let types;
    let typeMap;
    let momentTypes;
    let foundFirst;

    const settings = extend({}, defaults);

    // keep a shadow copy of this moment for calculating remainders
    let remainder = moment.duration(duration);

    // add a reference to this duration object to the settings for use
    // in a template function
    settings.duration = duration;

    // args
    if (template) {
        settings.template = template;
    }
    if (precision) {
        settings.precision = precision;
    }

    // types
    types = settings.types = _.isArray(settings.types) ? settings.types : settings.types.split(" ");

    // template
    if (_.isFunction(settings.template)) {
        settings.template = settings.template.apply(settings);
    }

    // tokenizer regexp
    tokenizer = new RegExp(_.map(types, type => settings[type].source).join("|"), "g");

    // token type map function
    typeMap = function(token) {
        return find(types, function(type) {
            return settings[type].test(token);
        });
    };

    // tokens array
    tokens = _.map(settings.template.match(tokenizer), (token, index) => {
        const type = typeMap(token);
        const length = token.length;
        return {
            index: index,
            length: length,
            token: type === "escape" ? token.replace(settings.escape, "$1") : token,
            type: type === "escape" || type === "general" ? null : type
        };
    });

    // unique moment token types in the template (in order of descending magnitude)
    momentTypes = intersection(types, unique(compact(pluck(tokens, "type"))));

    // exit early if there are no momentTypes
    if (!momentTypes.length) {
        return pluck(tokens, "token").join("");
    }

    // calculate values for each token type in the template
    _.each(momentTypes, (momentType, index) => {
        let value, wholeValue, decimalValue, isLeast, isMost;

        // calculate integer and decimal value portions
        value = remainder.as(momentType);

        wholeValue = value > 0 ? Math.floor(value) : Math.ceil(value);
        decimalValue = value - wholeValue;

        // is this the least-significant moment token found?
        isLeast = index + 1 === momentTypes.length;

        // is this the most-significant moment token found?
        isMost = !index;

        // update tokens array
        // using this algorithm to not assume anything about
        // the order or frequency of any tokens
        _.each(tokens, token => {
            if (token.type === momentType) {
                extend(token, {
                    value: value,
                    wholeValue: wholeValue,
                    decimalValue: decimalValue,
                    isLeast: isLeast,
                    isMost: isMost
                });

                if (isMost) {
                    // note the length of the most-significant moment token:
                    // if it is greater than one and forceLength is not set, default forceLength to `true`
                    if (settings.forceLength == null && token.length > 1) {
                        settings.forceLength = true;
                    }

                    // rationale is this:
                    //  - if the template is "h:mm:ss" and the moment value
                    //    is 5 minutes, the user-friendly output is "5:00", not "05:00"
                    //    shouldn't pad the `minutes` token even though it has length of two
                    //  - if the template is "hh:mm:ss", the user clearly wanted
                    //    everything padded so we should output "05:00"
                    //  - if the user wanted the full padded output, they can set
                    //    `{ trim: false }` to get "00:05:00"
                }
            }
        });

        // update remainder
        remainder.subtract(wholeValue, momentType);
    });

    //
    // trim tokens array
    //

    if (settings.trim) {
        tokens = (settings.trim === "left" ? rest : initial)(tokens, token => {
            // return `true` if:
            //  - the token is not the least moment token
            //    (don't trim the least moment token)
            //  - the token is a moment token that does not
            //    have a value (don't trim moment tokens that
            //    have a whole value)
            return !(token.isLeast || (token.type != null && token.wholeValue));
        });
    }

    //
    // build output
    //

    // the first moment token can have special handling
    foundFirst = false;

    // run the map in reverse order if trimming from the right
    if (settings.trim === "right") {
        tokens.reverse();
    }

    //
    // token:
    //   - type
    //   - token
    //   - wholeValue
    //   - length
    //   - isLeast
    //   - isMost
    //   - value
    //
    tokens = _.map(tokens, token => {
        let val;
        let decVal;

        if (!token.type) {
            // if it is not a moment token, use the token as its own value
            return token.token;
        }

        // apply negative precision formatting to the least-significant moment token
        if (token.isLeast && settings.precision < 0) {
            val = (
                Math.floor(token.wholeValue * Math.pow(10, settings.precision)) *
                Math.pow(10, -settings.precision)
            ).toString();
        } else {
            val = token.wholeValue.toString();
        }

        // remove negative sign from the beginning
        val = val.replace(/^\-/, "");

        // apply token length formatting
        // special handling for the first moment token that is not
        // the most significant in a trimmed template
        if (token.length > 1 && (foundFirst || token.isMost || settings.forceLength)) {
            val = padZero(val, token.length);
        }

        // add decimal value if precision > 0
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
                        padZero(
                            repeatZero(+decVal[2] - 1) + (decVal[0] || "0") + decVal[1],
                            settings.precision,
                            true
                        ).slice(0, settings.precision);
                    break;

                default:
                    throw new Error("Moment Duration Format: unable to parse token decimal value.");
            }
        }

        // add a negative sign if the value is negative and token is most significant
        if (token.isMost && token.value < 0) {
            val = "-" + val;
        }

        foundFirst = true;

        return val;
    });

    // undo the reverse if trimming from the right
    if (settings.trim === "right") {
        tokens.reverse();
    }

    return tokens.join("");
}
