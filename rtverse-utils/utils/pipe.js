"use strict";

const pipe = (source, target) => {
  if (!source.emit || !target.emit) {
    throw Error(`Please pass EventEmmiter as argument`);
  }
  const emit = (source._emit = source.emit);
  source.emit = function () {
    emit.apply(source, arguments);
    target.emit.apply(target, arguments);
    return source;
  };
};

module.exports = pipe;
