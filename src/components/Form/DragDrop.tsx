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

export function DDField({design, children = null, name, index, card = '', move = null, labelClass = 'p-col-12 p-md-4', label, ...props}) {
    let labelProps;
    let isDragging = false;
    if (design) {
        if (card) {
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
            isDragging = collected.isDragging;
            labelProps = {
                ref: dragField,
                style: {cursor: 'move'}
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
    }
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

export function DDCard({children = null, card, index, move = undefined, flex = '', design, drop = false, title, ...props}) {
    if (drop && !design) return null;
    let dropZone: ReactElement<HTMLDivElement>;
    let divProps;
    if (design) {
        const [{isDragging}, dragCard] = useDrag(
            () => ({
                type: CARD,
                item: { card, index, title },
                collect: monitor => ({
                    isDragging: !!monitor.isDragging()
                })
            }),
            [card, index[0], index[1]]
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
                canDrop: (item: {index: [any, any]}) => move && (item.index[0] !== index[0] || (!drop && item.index[1] !== index[1])),
                drop: item => move('card', item, {card, index}),
                collect: (monitor: CardMonitor) => ({
                    isOverCard: !!monitor.isOver(),
                    canDropCard: !!monitor.canDrop(),
                    dragTitle: monitor.getItem()?.title
                })
            }),
            [card, index[0], index[1], drop, move]
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
        divProps = {
            ref: dropCard
        };
        title = (drop && canDropCard) ? '👉 ' + dragTitle : <div ref={dragCard} style={{cursor: 'move'}}>{title}</div>;
        dropZone = canDropField && <div
            ref={dropField}
            className={clsx('p-field p-grid', flex)}
            style={{
                background: isOverField ? '#00ffff80' : 'transparent',
                outline: '1px dashed #00ffff80'
            }}
        >
            <label className='p-col-12'>👉 {dropLabel}</label>
        </div>;
    }
    return (
        <div {...divProps}>
            <Card title={title} {...props}>
                {children}
                {dropZone}
            </Card>
        </div>
    );
}
