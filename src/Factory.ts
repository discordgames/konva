import { isUnminified } from './Global';
import { Util } from './Util';

var GET = 'get',
  SET = 'set';

export const Factory = {
  addGetterSetter(constructor, attr, def?, validator?, after?) {
    this.addGetter(constructor, attr, def);
    this.addSetter(constructor, attr, validator, after);
    this.addOverloadedGetterSetter(constructor, attr);
  },
  addGetter(constructor, attr, def?) {
    var method = GET + Util._capitalize(attr);

    constructor.prototype[method] = function() {
      var val = this.attrs[attr];
      return val === undefined ? def : val;
    };
  },
  addSetter(constructor, attr, validator?, after?) {
    // if (!validator && validator !== null) {
    //   console.error(constructor, attr, 'has no validator.');
    // }
    var method = SET + Util._capitalize(attr);

    constructor.prototype[method] = function(val) {
      if (validator && val !== undefined && val !== null) {
        val = validator.call(this, val, attr);
      }

      this._setAttr(attr, val);

      if (after) {
        after.call(this);
      }

      return this;
    };
  },
  addComponentsGetterSetter(constructor, attr, components, validator?, after?) {
    var len = components.length,
      capitalize = Util._capitalize,
      getter = GET + capitalize(attr),
      setter = SET + capitalize(attr),
      n,
      component;

    // getter
    constructor.prototype[getter] = function() {
      var ret = {};

      for (n = 0; n < len; n++) {
        component = components[n];
        ret[component] = this.getAttr(attr + capitalize(component));
      }

      return ret;
    };

    // setter
    constructor.prototype[setter] = function(val) {
      var oldVal = this.attrs[attr],
        key;

      if (validator) {
        val = validator.call(this, val);
      }

      for (key in val) {
        if (!val.hasOwnProperty(key)) {
          continue;
        }
        this._setAttr(attr + capitalize(key), val[key]);
      }

      this._fireChangeEvent(attr, oldVal, val);

      if (after) {
        after.call(this);
      }

      return this;
    };

    this.addOverloadedGetterSetter(constructor, attr);
  },
  addOverloadedGetterSetter(constructor, attr) {
    var capitalizedAttr = Util._capitalize(attr),
      setter = SET + capitalizedAttr,
      getter = GET + capitalizedAttr;

    constructor.prototype[attr] = function() {
      // setting
      if (arguments.length) {
        this[setter](arguments[0]);
        return this;
      }
      // getting
      return this[getter]();
    };
  },
  addDeprecatedGetterSetter(constructor, attr, def, validator) {
    Util.error('Adding deprecated ' + attr);

    var method = GET + Util._capitalize(attr);

    var message =
      attr +
      ' property is deprecated and will be removed soon. Look at Konva change log for more information.';
    constructor.prototype[method] = function() {
      Util.error(message);
      var val = this.attrs[attr];
      return val === undefined ? def : val;
    };
    this.addSetter(constructor, attr, validator, function() {
      Util.error(message);
    });
    this.addOverloadedGetterSetter(constructor, attr);
  },
  backCompat(constructor, methods) {
    Util.each(methods, function(oldMethodName, newMethodName) {
      var method = constructor.prototype[newMethodName];
      var oldGetter = GET + Util._capitalize(oldMethodName);
      var oldSetter = SET + Util._capitalize(oldMethodName);

      function deprecated() {
        method.apply(this, arguments);
        Util.error(
          '"' +
            oldMethodName +
            '" method is deprecated and will be removed soon. Use ""' +
            newMethodName +
            '" instead.'
        );
      }

      constructor.prototype[oldMethodName] = deprecated;
      constructor.prototype[oldGetter] = deprecated;
      constructor.prototype[oldSetter] = deprecated;
    });
  },
  afterSetFilter() {
    this._filterUpToDate = false;
  }
};

export const Validators = {
  /**
   * @return {number}
   */
  RGBComponent(val) {
    if (val > 255) {
      return 255;
    } else if (val < 0) {
      return 0;
    }
    return Math.round(val);
  },
  alphaComponent(val) {
    if (val > 1) {
      return 1;
    } else if (val < 0.0001) {
      // chrome does not honor alpha values of 0
      return 0.0001;
    }

    return val;
  },
  _formatValue(val) {
    if (Util._isString(val)) {
      return '"' + val + '"';
    }
    if (Object.prototype.toString.call(val) === '[object Number]') {
      return val;
    }
    if (Util._isBoolean(val)) {
      return val;
    }
    return Object.prototype.toString.call(val);
  },
  getNumberValidator() {
    if (isUnminified) {
      return function(val, attr) {
        if (!Util._isNumber(val)) {
          Util.warn(
            Validators._formatValue(val) +
              ' is a not valid value for "' +
              attr +
              '" attribute. The value should be a number.'
          );
        }
        return val;
      };
    }
  },
  getNumberOrAutoValidator() {
    if (isUnminified) {
      return function(val, attr) {
        var isNumber = Util._isNumber(val);
        var isAuto = val === 'auto';

        if (!(isNumber || isAuto)) {
          Util.warn(
            Validators._formatValue(val) +
              ' is a not valid value for "' +
              attr +
              '" attribute. The value should be a number or "auto".'
          );
        }
        return val;
      };
    }
  },
  getStringValidator() {
    if (isUnminified) {
      return function(val, attr) {
        if (!Util._isString(val)) {
          Util.warn(
            Validators._formatValue(val) +
              ' is a not valid value for "' +
              attr +
              '" attribute. The value should be a string.'
          );
        }
        return val;
      };
    }
  },
  getFunctionValidator() {
    if (isUnminified) {
      return function(val, attr) {
        if (!Util._isFunction(val)) {
          Util.warn(
            Validators._formatValue(val) +
              ' is a not valid value for "' +
              attr +
              '" attribute. The value should be a function.'
          );
        }
        return val;
      };
    }
  },
  getNumberArrayValidator() {
    if (isUnminified) {
      return function(val, attr) {
        if (!Util._isArray(val)) {
          Util.warn(
            Validators._formatValue(val) +
              ' is a not valid value for "' +
              attr +
              '" attribute. The value should be a array of numbers.'
          );
        } else {
          val.forEach(function(item) {
            if (!Util._isNumber(item)) {
              Util.warn(
                '"' +
                  attr +
                  '" attribute has non numeric element ' +
                  item +
                  '. Make sure that all elements are numbers.'
              );
            }
          });
        }
        return val;
      };
    }
  },
  getBooleanValidator() {
    if (isUnminified) {
      return function(val, attr) {
        var isBool = val === true || val === false;
        if (!isBool) {
          Util.warn(
            Validators._formatValue(val) +
              ' is a not valid value for "' +
              attr +
              '" attribute. The value should be a boolean.'
          );
        }
        return val;
      };
    }
  }
};
