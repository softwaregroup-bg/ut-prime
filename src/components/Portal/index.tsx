import React from 'react';
import Box, {Item} from 'devextreme-react/box';
import { connect } from 'react-redux';

import Menu from 'devextreme-react/menu';

// import Header from 'ut-front-react/components/HeaderNew';
import { logout } from 'ut-front-react/containers/LoginForm/actions';
import TabMenu from 'ut-front-react/containers/TabMenu';

import Pages from '../Pages';
import Context from '../Context';
import Text from '../Text';

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

const Portal: StyledType = ({ classes, login, logout, children, tabMenu }) => {
    const size = useWindowSize();
    const loginResult = login.get('result');
    if (!loginResult) return null;
    const {portalName, menu, showTab} = React.useContext(Context);
    const handleClick = ({itemData}) => itemData.page && showTab({
        component: itemData.page,
        title: itemData.title,
        path: '/' + itemData.page.name
    });
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
                {/* <Header
                    currentLocation={location.pathname}
                    personInfo={loginResult && loginResult.toJS()}
                    logout={logout}
                    replaceWithBrakes
                    tabset={menu}
                    headerText={portalName}
                /> */}
            </Item>
            <Item baseSize={40}>
                <TabMenu defaultLocation='/' {...tabMenu} />
            </Item>
            <Item ratio={1}>
                <Pages tabs={tabMenu.tabs} />
                {children}
            </Item>
        </Box>
    );
};

export default connect(
    ({login, tabMenu}) => ({login, tabMenu}),
    {logout}
)(Styled(Portal));
