import { push } from 'connected-react-router';
import flatten from 'ut-function.flatten';

const query = ({id, ...rest}) => {
    id = (id != null) ? '/' + id : '';
    if (Object.keys(rest).length) {
        const query = new URLSearchParams(flatten(rest, 5));
        query.sort();
        return id + '?' + query.toString();
    } else return id;
};

export default store => next => async action => {
    switch (action.type) {
        case 'front.tab.show': {
            const {title: tabTitle, component} = action.tab ? await action.tab({}) : action;
            const {title = tabTitle, ...params} = action.params || {};
            if (typeof component === 'string') return next(push('/p/' + action.component + query(params)));
            if (!action.path) {
                action.path = '/' + action.tab.name.split('/').pop() + query(params);
            }
            const result = next({...action, title, Component: await component(action.params || {})});
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
