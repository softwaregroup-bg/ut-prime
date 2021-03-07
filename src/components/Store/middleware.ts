import { push } from 'connected-react-router';

export default store => next => action => {
    switch (action.type) {
        case 'front.tab.show': {
            if (!action.path) action.path = '/' + action.component.name.split('/').pop();
            const result = next(action);
            next(push(action.path));
            return result;
        }
        case 'front.tab.close': {
            const result = next(action);
            next(push(action.push || '/'));
            return result;
        }
        default:
            return next(action);
    }
};
