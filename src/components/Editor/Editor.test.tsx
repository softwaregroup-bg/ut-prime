import React from 'react';

import { render, act } from '../test';
import { Basic, Loading, Design, Tabs, Submit, Files, FilesInTab, Validation, ServerValidation, Toolbar } from './Editor.stories';
import {CascadedDropdowns} from './stories/CascadedDropdowns.stories';
import {CascadedTables} from './stories/CascadedTables.stories';
import {CustomEditors} from './stories/CustomEditors.stories';
import {MasterDetail} from './stories/MasterDetail.stories';
import {MasterDetailPolymorphic} from './stories/MasterDetailPolymorphic.stories';
import {Pivot} from './stories/Pivot.stories';
import {PolymorphicLayout} from './stories/PolymorphicLayout.stories';
import {ResponsiveLayout} from './stories/ResponsiveLayout.stories';
import {TabbedLayout} from './stories/TabbedLayout.stories';
import {ThumbIndexLayout} from './stories/ThumbIndexLayout.stories';
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
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Design render equals snapshot', async() => {
        const { findByTestId } = render(<Design {...Design.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Tabs render equals snapshot', async() => {
        const { findByTestId } = render(<Tabs {...Tabs.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CascadedDropdowns render equals snapshot', async() => {
        const { findByTestId, container } = render(<CascadedDropdowns />);
        await act(() => CascadedDropdowns.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CascadedTables render equals snapshot', async() => {
        const { findByTestId, container } = render(<CascadedTables />);
        await act(() => CascadedTables.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('CustomEditors render equals snapshot', async() => {
        const { findByTestId } = render(<CustomEditors />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('MasterDetail render equals snapshot', async() => {
        const { findByTestId, container } = render(<MasterDetail />);
        await act(() => MasterDetail.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('MasterDetailPolymorphic render equals snapshot', async() => {
        const { findByTestId, container } = render(<MasterDetailPolymorphic />);
        await act(() => MasterDetailPolymorphic.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Pivot render equals snapshot', async() => {
        const { findByTestId } = render(<Pivot />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('PolymorphicLayout render equals snapshot', async() => {
        const { findByTestId } = render(<PolymorphicLayout />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('ResponsiveLayout render equals snapshot', async() => {
        const { findByTestId } = render(<ResponsiveLayout />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('TabbedLayout render equals snapshot', async() => {
        const { findByTestId } = render(<TabbedLayout />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('ThumbIndexLayout render equals snapshot', async() => {
        const { findByTestId } = render(<ThumbIndexLayout />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Submit render equals snapshot', async() => {
        const { findByTestId, container } = render(<Submit {...Submit.args} />);
        await act(() => Submit.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Validation render equals snapshot', async() => {
        const { findByTestId, container } = render(<Validation {...Validation.args} />);
        await act(() => Validation.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Server validation render equals snapshot', async() => {
        const { findByTestId, container } = render(<ServerValidation {...ServerValidation.args} />);
        await act(() => ServerValidation.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Toolbar render equals snapshot', async() => {
        const { findByTestId } = render(<Toolbar {...Toolbar.args} />);
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('Files render equals snapshot', async() => {
        const { findByTestId, container } = render(<Files {...Files.args} />);
        await act(() => Files.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
    it('FilesInTab render equals snapshot', async() => {
        const { findByTestId, container } = render(<FilesInTab {...FilesInTab.args} />);
        await act(() => FilesInTab.play({canvasElement: container}));
        expect(await findByTestId('ut-front-test')).toMatchSnapshot();
    });
});
