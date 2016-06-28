'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utilities = require('./utilities');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable lodash3/prefer-lodash-method */

exports.default = function (reducers, RecordClass) {
    var reducerKeys = void 0;

    reducerKeys = Object.keys(reducers);

    return function (inputState, action) {
        if (inputState === undefined) {
            inputState = _immutable2.default.Map();
        }

        if (RecordClass && !(inpuState instanceof RecordClass)) {
            inputState = new RecordClass(inputState);
        }

        /* eslint-disable no-process-env */
        if (process.env.NODE_ENV !== 'production') {
            /* eslint-enable no-process-env */
            var warningMessage = void 0;

            warningMessage = (0, _utilities.getUnexpectedInvocationParameterMessage)(inputState, reducers, action);

            if (warningMessage) {
                /* eslint-disable no-console */
                console.error(warningMessage);
                /* eslint-enable no-console */
            }
        }

        return inputState.withMutations(function (temporaryState) {
            reducerKeys.forEach(function (reducerName) {
                var currentDomainState = void 0,
                    nextDomainState = void 0,
                    reducer = void 0;

                reducer = reducers[reducerName];

                currentDomainState = temporaryState.get(reducerName);

                nextDomainState = reducer(currentDomainState, action);

                (0, _utilities.validateNextState)(nextDomainState, reducerName, action);

                temporaryState.set(reducerName, nextDomainState);
            });
        });
    };
};

module.exports = exports['default'];
//# sourceMappingURL=combineReducers.js.map
