
// node 0.10.x doesn't have Object.setPrototypeOf yet
// shim from https://gist.github.com/WebReflection/5593554

/*jslint devel: true, indent: 2 */
// 15.2.3.2
if (!Object.setPrototypeOf) {
  Object.setPrototypeOf = (function(Object, magic) {
    'use strict';
    var set;
    function checkArgs(O, proto) {
      if (typeof O !== 'object' || O === null) {
        throw new TypeError('can not set prototype on a non-object');
      }
      if (typeof proto !== 'object' && proto !== null) {
        throw new TypeError('can only set prototype to an object or null');
      }
    }
    function setPrototypeOf(O, proto) {
      checkArgs(O, proto);
      set.call(O, proto);
      return O;
    }
    try {
      // this works already in Firefox and Safari
      set = Object.getOwnPropertyDescriptor(Object.prototype, magic).set;
      set.call({}, null);
    } catch (o_O) {
      if (Object.prototype !== {}[magic]) {
        // IE < 11 cannot be shimmed
        return;
      }
      // probably Chrome or some old Mobile stock browser
      set = function(proto) {
        this[magic] = proto;
      };
      // please note that this will **not** work
      // in those browsers that do not inherit
      // __proto__ by mistake from Object.prototype
      // in these cases we should probably throw an error
      // or at least be informed about the issue
      setPrototypeOf.polyfill = setPrototypeOf(
        setPrototypeOf({}, null),
        Object.prototype
      ) instanceof Object;
      // setPrototypeOf.polyfill === true means it works as meant
      // setPrototypeOf.polyfill === false means it's not 100% reliable
      // setPrototypeOf.polyfill === undefined
      // or
      // setPrototypeOf.polyfill ==  null means it's not a polyfill
      // which means it works as expected
      // we can even delete Object.prototype.__proto__;
    }
    return setPrototypeOf;
  }(Object, '__proto__'));
}

