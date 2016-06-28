/* eslint-disable lodash3/prefer-lodash-method */

import {
    getUnexpectedInvocationParameterMessage,
    validateNextState
} from './utilities';

import Immutable from 'immutable';

export default (reducers: Object, RecordClass: ?Immutable.Record): Function => {
    let reducerKeys;

    reducerKeys = Object.keys(reducers);

    return (inputState: ?Immutable, action: Object): Immutable => {
        if (inputState === undefined) {
          inputState = Immutable.Map();
        }

        if (RecordClass && !(inpuState instanceof RecordClass)) {
            inputState = new RecordClass(inputState)
        }

        /* eslint-disable no-process-env */
        if (process.env.NODE_ENV !== 'production') {
        /* eslint-enable no-process-env */
            let warningMessage;

            warningMessage = getUnexpectedInvocationParameterMessage(inputState, reducers, action);

            if (warningMessage) {
                /* eslint-disable no-console */
                console.error(warningMessage);
                /* eslint-enable no-console */
            }
        }

        return inputState
            .withMutations((temporaryState) => {
                reducerKeys.forEach((reducerName) => {
                    let currentDomainState,
                        nextDomainState,
                        reducer;

                    reducer = reducers[reducerName];

                    currentDomainState = temporaryState.get(reducerName);

                    nextDomainState = reducer(currentDomainState, action);

                    validateNextState(nextDomainState, reducerName, action);

                    temporaryState.set(reducerName, nextDomainState);
                });
            });
    };
};
