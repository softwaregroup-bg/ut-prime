import React, { ReactElement } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { DropTargetMonitor } from 'react-dnd';
import { Card } from '../prime';
import clsx from 'clsx';

const FIELD = Symbol('field');
type FieldMonitor = DropTargetMonitor<{
    card: string,
    label: string,
    index: number
}>;
const CARD = Symbol('card');
type CardMonitor = DropTargetMonitor<{
    card: string,
    title: string,
    index: [number, number | false]
}>;

export function DragDropField({children, name, index, card, move, labelClass, label, ...props}) {
    let labelProps;
    let isDragging = false;
    const [collected, dragField] = useDrag(
        () => ({
            type: FIELD,
            item: { index, card, label },
            collect: monitor => ({
                isDragging: !!monitor.isDragging()
            })
        }),
        [card, index]
    );
    if (card) {
        isDragging = collected.isDragging;
        labelProps = {
            ref: dragField,
            style: {cursor: 'move'}
        };
        if (!label) {
            label = <span>&nbsp;</span>;
            labelClass = labelClass + ' absolute w-15rem';
        }
    }
    const [{ canDrop, isOver }, dropField] = useDrop(
        () => ({
            accept: FIELD,
            canDrop: () => !isDragging && move,
            drop: item => move('field', item, {index, card}),
            collect: monitor => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        }),
        [card, index, isDragging, move]
    );
    props.ref = dropField;
    props.style = {
        ...isDragging && {opacity: 0.5},
        ...!isDragging && canDrop && {
            ...isOver && {background: '#00ffff80'},
            outline: '1px dashed #00ffff80'
        }
    };
    return (
        <div {...props}>
            {
                label ? <label className={labelClass} htmlFor={name} {...labelProps}>
                    {label}
                </label> : null
            }
            {children}
        </div>
    );
}

export function DragDropCard({children, card, index1, index2, move, flex, hidden, drop, title, ...props}) {
    const [{isDragging}, dragCard] = useDrag(
        () => ({
            type: CARD,
            item: { card, index: [index1, index2], title },
            collect: monitor => ({
                isDragging: !!monitor.isDragging()
            })
        }),
        [card, index1, index2]
    );
    const [{ isOverField, canDropField, dropLabel }, dropField] = useDrop(
        () => ({
            accept: FIELD,
            canDrop: (item: {card: string}) => item.card !== card,
            drop: item => move('field', item, {index: 1000, card}),
            collect: (monitor: FieldMonitor) => ({
                isOverField: !!monitor.isOver(),
                canDropField: !!monitor.canDrop(),
                dropLabel: monitor.getItem()?.label
            })
        }),
        [card]
    );
    const [{ isOverCard, canDropCard, dragTitle }, dropCard] = useDrop(
        () => ({
            accept: CARD,
            canDrop: (item: {index: [any, any]}) => move && (item.index[0] !== index1 || (!drop && item.index[1] !== index2)),
            drop: item => move('card', item, {card, index: [index1, index2]}),
            collect: (monitor: CardMonitor) => ({
                isOverCard: !!monitor.isOver(),
                canDropCard: !!monitor.canDrop(),
                dragTitle: monitor.getItem()?.title
            })
        }),
        [card, index1, index2, drop, move]
    );
    props.style = {
        ...isDragging && {opacity: 0.5},
        ...!isDragging && canDropCard && {
            ...isOverCard && {background: '#00ffff80'},
            outline: '1px dashed #00ffff80'
        },
        ...drop && {opacity: 0.5},
        ...drop && !canDropCard && {
            display: 'none'
        }
    };
    const divProps = {
        ref: dropCard
    };
    title = (drop && canDropCard) ? '👉 ' + dragTitle : <div ref={dragCard} style={{cursor: 'move'}}>{title}</div>;
    const dropZone: ReactElement<HTMLDivElement> = canDropField && <div
        ref={dropField}
        className={clsx('field grid', flex)}
        style={{
            background: isOverField ? '#00ffff80' : 'transparent',
            outline: '1px dashed #00ffff80'
        }}
    >
        <label className='col-12'>👉 {dropLabel}</label>
    </div>;

    return (
        <div {...divProps}>
            <Card title={title} {...props}>
                {children}
                {dropZone}
            </Card>
        </div>
    );
}

export function ConfigField({design, children = null, name, index, card = '', move = null, labelClass = 'col-12 md:col-4', label, ...props}) {
    return (
        design ? <DragDropField {...{name, index, card, move, labelClass, label, ...props}}>
            {children}
        </DragDropField> : <div {...props}>
            {
                label ? <label className={labelClass} htmlFor={name}>
                    {label}
                </label> : null
            }
            {children}
        </div>
    );
}

export function ConfigCard({children = null, card, index1, index2, move = undefined, flex = '', design, hidden = false, drop = false, title, ...props}) {
    if (drop && !design) return null;
    return (
        design ? <DragDropCard {...{card, index1, index2, move, flex, hidden, drop, title, ...props}}>
            {children}
        </DragDropCard> : <div>
            <Card title={title} {...props}>
                {children}
            </Card>
        </div>
    );
}
