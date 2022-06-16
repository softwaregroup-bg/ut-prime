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

export function DragDropField({children, name, index, card, move, label, ...props}) {
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
            style: {cursor: 'move', marginLeft: '-1em'}
        };
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
            <label className='absolute w-15rem col' {...labelProps}>📎</label>
            {children}
        </div>
    );
}

export function DragDropCard({children, card, index1, index2, move, flex, hidden, drag, drop, title, ...props}) {
    const [{isDragging}, dragCard] = useDrag(
        () => ({
            type: CARD,
            item: { card, index: [index1, index2], title },
            canDrag: !drop,
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
        ...drop && {opacity: 0.5}
    };
    const divProps = {
        ref: dropCard
    };
    title = (drop && canDropCard) ? '👉 ' + dragTitle : <div ref={dragCard} style={drop ? {} : {cursor: 'move'}}>{title}</div>;
    const dropZone: ReactElement<HTMLDivElement> = !drop && <div
        ref={dropField}
        className={clsx('field grid', flex)}
        style={{
            background: isOverField && canDropField ? '#00ffff80' : 'transparent',
            outline: canDropField ? '1px dashed #00ffff80' : 'none'
        }}
    >
        <label className='col-12'>{canDropField ? '👉' : ''}&nbsp;{canDropField ? dropLabel : ''}</label>
    </div>;

    return (
        <div {...divProps}>{
            (drop || drag) ? <Card title={title} {...props}/> : <Card title={title} {...props}>
                {children}
                {dropZone}
            </Card>
        }</div>
    );
}

export function ConfigField({design, children = null, name, index, card = '', label, move = null, ...props}) {
    return (
        design ? <DragDropField {...{name, index, card, move, label, ...props}}>
            {children}
        </DragDropField> : props.className ? <div {...props}>
            {children}
        </div> : children
    );
}

export function ConfigCard({children = null, card, index1, index2, move = undefined, flex = '', design, hidden = false, drag = false, drop = false, title, ...props}) {
    if (drop && !design) return null;
    return (
        design ? <DragDropCard {...{card, index1, index2, move, flex, hidden, drag, drop, title, ...props}}>
            {children}
        </DragDropCard> : <div>
            <Card title={title} {...props}>
                {children}
            </Card>
        </div>
    );
}
