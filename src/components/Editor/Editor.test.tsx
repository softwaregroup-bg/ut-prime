import React from 'react';

import { render, act } from '../test';
import {
    Basic,
    Loading,
    Design,
    Tabs,
    Submit,
    Files,
    FilesInTab,
    ServerValidation,
    Toolbar,
    Steps,
    StepsDisabledBack,
    StepsHiddenBack,
    EditorWithExplorer
} from './Editor.stories';
import {CascadedDropdowns} from './stories/CascadedDropdowns.stories';
import {CascadedTables} from './stories/CascadedTables.stories';
import {CustomEditors} from './stories/CustomEditors.stories';
import {MasterDetail} from './stories/MasterDetail.stories';
import {MasterDetailPolymorphic} from './stories/MasterDetailPolymorphic.stories';
import {Pivot, PivotBG} from './stories/Pivot.stories';
import {PolymorphicLayout} from './stories/PolymorphicLayout.stories';
import {ResponsiveLayout} from './stories/ResponsiveLayout.stories';
import {TabbedLayout} from './stories/TabbedLayout.stories';
import {ThumbIndexLayout} from './stories/ThumbIndexLayout.stories';
import {Validation, ValidationBG} from './stories/Validation.stories';
import { config } from 'react-transition-group';

config.disabled = true;

describe('<Editor />', () => {
    it('Basic render equals snapshot', async() => {
        const { findByTestId } = render(<Basic {...Basic.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Loading render equals snapshot', async() => {
        const { findByTestId } = render(<Loading {...Loading.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Design render equals snapshot', async() => {
        const { findByTestId } = render(<Design {...Design.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Tabs render equals snapshot', async() => {
        const { findByTestId } = render(<Tabs {...Tabs.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CascadedDropdowns render equals snapshot', async() => {
        const { findByTestId, container } = render(<CascadedDropdowns />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => CascadedDropdowns.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CascadedTables render equals snapshot', async() => {
        const { findByTestId, container } = render(<CascadedTables />, undefined, 'en');
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => CascadedTables.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CustomEditors render equals snapshot', async() => {
        const { findByTestId } = render(<CustomEditors />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('MasterDetail render equals snapshot', async() => {
        const { findByTestId, container } = render(<MasterDetail />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => MasterDetail.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('MasterDetailPolymorphic render equals snapshot', async() => {
        const { findByTestId, container } = render(<MasterDetailPolymorphic />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => MasterDetailPolymorphic.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Pivot render equals snapshot', async() => {
        const { findByTestId } = render(<Pivot />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Pivot BG render equals snapshot', async() => {
        const { findByTestId } = render(<PivotBG />, undefined, 'bg');
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('PolymorphicLayout render equals snapshot', async() => {
        const { findByTestId } = render(<PolymorphicLayout />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('ResponsiveLayout render equals snapshot', async() => {
        const { findByTestId } = render(<ResponsiveLayout />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('TabbedLayout render equals snapshot', async() => {
        const { findByTestId } = render(<TabbedLayout />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('ThumbIndexLayout render equals snapshot', async() => {
        const { findByTestId } = render(<ThumbIndexLayout />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Submit render equals snapshot', async() => {
        const { findByTestId, container } = render(<Submit {...Submit.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => Submit.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Validation render equals snapshot', async() => {
        const { findByTestId, container } = render(<Validation {...Validation.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => Validation.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('ValidationBG render equals snapshot', async() => {
        const { findByTestId, container } = render(<ValidationBG {...ValidationBG.args} />, undefined, 'bg');
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => ValidationBG.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Server validation render equals snapshot', async() => {
        const { findByTestId, container } = render(<ServerValidation {...ServerValidation.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => ServerValidation.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Toolbar render equals snapshot', async() => {
        const { findByTestId } = render(<Toolbar {...Toolbar.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Files render equals snapshot', async() => {
        const { findByTestId, container } = render(<Files {...Files.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => Files.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('FilesInTab render equals snapshot', async() => {
        const { findByTestId, container } = render(<FilesInTab {...FilesInTab.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => FilesInTab.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Steps render equals snapshot', async() => {
        const { findByTestId } = render(<Steps {...Steps.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('StepsDisabledBack render equals snapshot', async() => {
        const { findByTestId } = render(<StepsDisabledBack {...StepsDisabledBack.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('StepsHiddenBack render equals snapshot', async() => {
        const { findByTestId } = render(<StepsHiddenBack {...StepsHiddenBack.args} />);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('EditorTabsExplorer render equals snapshot', async() => {
        const { findByTestId, container } = render(<EditorWithExplorer {...EditorWithExplorer.args} />, undefined, undefined, EditorWithExplorer.args.middleware);
        await act(() => new Promise(resolve => setTimeout(resolve, 1000)));
        await act(() => EditorWithExplorer.play({canvasElement: container}));
        await act(() => new Promise(resolve => setTimeout(resolve, 500)));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
