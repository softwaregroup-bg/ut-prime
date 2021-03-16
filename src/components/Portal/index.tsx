import React from 'react';
import Box, {Item} from 'devextreme-react/box';
import { useSelector, useDispatch } from 'react-redux';
import TabPanel from 'devextreme-react/tab-panel';
import { useLocation, useHistory } from 'react-router-dom';

import Menu from 'devextreme-react/menu';

import Context from '../Context';
import Text from '../Text';

import Title from './Title';
import { Styled, StyledType } from './Portal.types';

// https://usehooks.com/useWindowSize/
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = React.useState({
        width: undefined,
        height: undefined
    });

    React.useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}

const ItemComponent = ({Component, params}) => <Component {...params} />;

const Portal: StyledType = ({ classes, children }) => {
    const {tabs = [], menu = []} = useSelector(state => state.portal || {});
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const size = useWindowSize();
    const {portalName} = React.useContext(Context);
    const handleClick = React.useCallback(({itemData}) => {
        if (itemData.component || itemData.tab) dispatch({type: 'front.tab.show', ...itemData});
    }, [dispatch]);
    const found = tabs.findIndex(tab => tab.path === location.pathname);
    const tabIndex = found >= 0 ? found : undefined;
    const handleTabSelect = React.useCallback(({name, value}) => {
        if (name === 'selectedIndex') history.push(tabs[value].path);
    }, [tabs]);
    if (location.pathname !== '/' && !tabs.find(tab => tab.path === location.pathname)) {
        dispatch({
            type: 'portal.route.find',
            path: location.pathname
        });
    }
    return (
        <Box direction='col' width='100%' height={size.height}>
            <Item baseSize={59}>
                <div className={classes.headerContainer}>
                    <Box direction='row' height='100%' crossAlign='center'>
                        <Item baseSize={46}>
                            <div className={classes.headerLogo}></div>
                        </Item>
                        <Item baseSize='auto'>
                            <div className={classes.headerTitle}>
                                <Text>{portalName}</Text>
                            </div>
                        </Item>
                        <Item baseSize='auto'>
                            <Menu dataSource={menu}
                                displayExpr='title'
                                showFirstSubmenuMode='onClick'
                                orientation='horizontal'
                                submenuDirection='auto'
                                hideSubmenuOnMouseLeave={false}
                                onItemClick={handleClick}
                            />
                        </Item>
                    </Box>
                </div>
            </Item>
            <Item ratio={1}>
                <TabPanel
                    height='100%'
                    dataSource={tabs}
                    selectedIndex={tabIndex}
                    itemTitleComponent={Title}
                    repaintChangesOnly
                    itemRender={ItemComponent}
                    onOptionChanged={handleTabSelect}
                    noDataText=''
                />
                {children}
            </Item>
        </Box>
    );
};

export default Styled(Portal);
