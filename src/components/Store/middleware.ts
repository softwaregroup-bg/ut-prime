import { push } from 'connected-react-router';
import flatten from 'ut-function.flatten';

export default store => next => async action => {
    switch (action.type) {
        case 'front.tab.show': {
            const {title: tabTitle, component} = action.tab ? await action.tab({}) : action;
            const {id, title = tabTitle, ...params} = action?.params || {};
            if (!action.path) {
                let query;
                if (Object.keys(params).length) {
                    query = new URLSearchParams(flatten(params, 5));
                    query.sort();
                    query = '?' + query.toString();
                } else query = '';
                action.path = '/' + action.tab.name.split('/').pop() + ((id != null) ? '/' + id : '') + query;
            }
            const result = next({...action, title, Component: await component(action?.params || {})});
            next(push(action.path));
            return result;
        }
        case 'front.page.show': {
            const {title: tabTitle, component, path: tabPath} = action.tab ? await action.tab({}) : action;
            const {id, title = tabTitle, path = tabPath, ...params} = action?.params || {};
            if (!action.path) {
                let query;
                if (Object.keys(params).length) {
                    query = new URLSearchParams(flatten(params, 5));
                    query.sort();
                    query = '?' + query.toString();
                } else query = '';
                action.path = path || ('/' + action.tab.name.split('/').pop()) + ((id != null) ? '/' + id : '') + query;
            }
            const result = next({...action, title, Component: await component(action?.params || {})});
            if (action?.location?.pathname !== action.path) next(push(action.path));
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
