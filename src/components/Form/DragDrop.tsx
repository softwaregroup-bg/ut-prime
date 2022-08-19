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
            ref: dragField
        };
    }
    const [{ canDrop, isOver }, dropField] = useDrop(
        () => ({
            accept: name === 'trash' ? [FIELD, CARD] : FIELD,
            canDrop: () => !isDragging && move,
            drop: (item, monitor) => move(monitor.getItemType() === CARD ? 'card' : 'field', item, {index, card}),
            collect: monitor => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        }),
        [card, index, isDragging, move]
    );
    props.ref = dropField;
    props.style = {
        position: 'relative',
        ...isDragging && {opacity: 0.5},
        ...!isDragging && canDrop && {
            ...isOver && {background: 'var(--primary-color)', opacity: 0.5},
            outline: '1px dashed',
            outlineColor: 'var(--primary-color)'
        }
    };
    if (name === 'trash' && !canDrop) return null;
    return (
        <div {...props}>
            {children}
            {name === 'trash' ? null : <label className='absolute border-1 border-solid border-transparent top-0 bottom-0 left-0 right-0 cursor-move mb-0' {...labelProps}>&nbsp;</label>}
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
            canDrop: (item: {index: [unknown, unknown]}) => move && (item.index[0] !== index1 || (!drop && item.index[1] !== index2)),
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
            ...isOverCard && {background: 'var(--primary-color)', opacity: 0.5},
            outline: '1px dashed var(--primary-color)'
        },
        ...drop && {opacity: 0.5}
    };
    const divProps = {
        ref: dropCard
    };
    title = (drop && canDropCard) ? '➕ ' + dragTitle : <div ref={dragCard} style={drop ? {} : {cursor: 'move'}}>{title}</div>;
    const dropZone: ReactElement<HTMLDivElement> = !drop && <div
        ref={dropField}
        className={clsx('field', 'grid', 'mb-0', flex)}
        style={{
            background: isOverField && canDropField ? 'var(--primary-color)' : 'transparent',
            outline: canDropField ? '1px dashed var(--primary-color)' : 'none'
        }}
    >
        <label className='col-12'>{canDropField ? '➕' : ''}&nbsp;{canDropField ? dropLabel : ''}</label>
    </div>;

    return (
        <div {...divProps}>{
            drag ? <div ref={dragCard} className={clsx('cursor-move', props.className)}>{children}</div> : drop ? <Card title={title} {...props}>{children}</Card> : <Card title={title} {...props}>
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
        </DragDropCard> : <div className='w-full'>
            <Card title={title} {...props}>
                {children}
            </Card>
        </div>
    );
}
