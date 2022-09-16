import React from 'react';
import type { Story, Meta } from '@storybook/react';

import page from './README.mdx';
import type { Props } from './Scrollbox.types';
import Scrollbox from './index';
import decorators from '../test/decorator';

const meta: Meta = {
    title: 'Scrollbox',
    component: Scrollbox,
    parameters: {docs: {page}},
    decorators,
    args: {
        state: {}
    }
};
export default meta;

declare type StoryTemplate = Story<Partial<Props>> & {
    play: (context: {canvasElement: HTMLElement}) => Promise<void>
}

const Template: Story<Props> = args => <Scrollbox {...args} />;

export const Basic: StoryTemplate = Template.bind({});
Basic.args = {
    className: 'col-2',
    children: <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam totam expedita adipisci perspiciatis unde magni et ipsa quis possimus quam? Commodi eligendi quisquam voluptatem consequatur, iste ut sunt vel expedita autem omnis blanditiis ex id, asperiores fugit ducimus obcaecati. Maxime excepturi ex ipsa id praesentium! Molestias consequatur eos, amet nemo aspernatur necessitatibus optio. Nisi, assumenda odio exercitationem quia iure ducimus eos non? Asperiores quasi labore, iste, inventore molestias natus, eaque error praesentium ipsa placeat perspiciatis in expedita illo similique. Odio quis maxime exercitationem fugit, possimus vero rem vitae neque similique, modi omnis quidem recusandae nostrum corporis voluptatem harum culpa eaque sit veniam? Saepe nobis sed excepturi, in repellendus expedita cumque adipisci temporibus deleniti ex quis? Nemo doloribus corrupti impedit? Officiis odio veritatis animi aspernatur voluptatum, repudiandae magni doloremque aut commodi labore reiciendis eaque corporis deserunt nam, expedita dolores, ab et? Reprehenderit dolore suscipit debitis provident perferendis, minima cumque tenetur voluptatibus magnam beatae earum! Fuga adipisci maxime distinctio aspernatur sit unde, impedit, nulla quibusdam cupiditate blanditiis ut, provident veniam dolore aperiam quidem perspiciatis. Eligendi illum itaque dicta perferendis temporibus, molestias rerum excepturi nesciunt qui repellat cum voluptatem iusto quasi magnam libero eius labore maxime nemo? Ex nobis blanditiis incidunt eos. Autem architecto dignissimos illo cumque rem ipsum ratione quam dolorem quae perspiciatis possimus praesentium, tempore eius quo eligendi placeat odio doloremque mollitia repellendus vitae optio quos cupiditate quisquam accusantium! Id autem cumque a saepe consequatur! Hic modi vero, officiis, sit eum corporis error fugiat et non maxime laudantium illo voluptatum eveniet, dolor excepturi assumenda unde necessitatibus iure labore itaque totam vitae delectus consequuntur ab. Quod distinctio odio est esse cumque officiis cupiditate aperiam magnam rerum, hic sed incidunt temporibus enim beatae veritatis iure non aspernatur voluptates ab quo, aut quasi neque minus?</p>
};
