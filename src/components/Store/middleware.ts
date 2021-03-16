import { push } from 'connected-react-router';

export default store => next => async action => {
    switch (action.type) {
        case 'front.tab.show': {
            const {title, component} = action.tab ? await action.tab({}) : action;
            if (!action.path) {
                const id = action?.params?.id;
                action.path = '/' + action.tab.name.split('/').pop() + (id ? '/' + id : '');
            }
            const result = next({...action, title, Component: await component()});
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
