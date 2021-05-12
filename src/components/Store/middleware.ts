import { push } from 'connected-react-router';

export default store => next => async action => {
    switch (action.type) {
        case 'front.tab.show': {
            const {title, component} = action.tab ? await action.tab({}) : action;
            const id = action?.params?.id;
            if (!action.path) {
                action.path = '/' + action.tab.name.split('/').pop() + (component.length ? '/' + id : '');
            }
            const result = next({...action, title, Component: await component({id})});
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
