import React from 'react';
import type { Meta } from '@storybook/react';

import page from './README.mdx';
import Text from './index';
import Context from '../Text/context';

const meta: Meta = {
    title: 'Text',
    component: Text,
    parameters: { docs: { page } },
    args: {
        state: {
        }
    }
};
export default meta;

const content = 'Text content, which can be translated';
const id = 'some-id';

function translate(id, text, language) {
    return {
        bg: {
            [content]: 'Текстово съдържание, което може да се преведе',
            [id]: 'Превод чрез Text.id'
        },
        ar: {
            [content]: 'محتوى النص الذي يمكن ترجمته',
            [id]: 'ترجمة عبر Text.id'
        },
        en: {
            [id]: 'Translation via Text.id'
        }
    }[language || 'en'][id || text];
}

export const Basic: React.FC = () => <div className='w-30rem border-solid surface-border border-1 p-3 m-3 relative text-primary'>
    <div className='p-component'>
        <span className='text-color'>Original: </span>
        <Text>{content}</Text>
    </div>
    <Context.Provider value={{ translate }}>
        <div className='p-component'>
            <span className='text-color'>Original via id: </span>
            <Text id={id}>{content}</Text>
        </div>
    </Context.Provider>
    <Context.Provider value={{ language: 'bg', translate }}>
        <div className='p-component'>
            <span className='text-color'>Bulgarian: </span>
            <Text>{content}</Text>
        </div>
        <div className='p-component'>
            <span className='text-color'>Bulgarian via Text.id: </span>
            <Text id={id}>{content}</Text>
        </div>
        <div dir='rtl' className='p-component'>
            <span className='text-color absolute left-0 ml-3'>:Arabic</span>
            <Text lang='ar'>{content}</Text>
        </div>
        <div dir='rtl' className='p-component'>
            <span className='text-color absolute left-0 ml-3'>:Arabic via Text.id</span>
            <Text lang='ar' id={id}>{content}</Text>
        </div>
    </Context.Provider>
</div>;
