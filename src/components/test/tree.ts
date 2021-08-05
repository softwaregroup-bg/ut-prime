import Joi from 'joi';
import type {Properties, Cards} from '../types';

const tree: {properties: Properties, cards: Cards} = {
    properties: {
        treeId: {
            validation: Joi.number().integer()
        },
        treeName: {
            title: 'Name'
        },
        treeDescription: {
            title: 'Description',
            editor: {
                type: 'text'
            }
        },
        treeType: {
            title: 'Type',
            editor: {
                type: 'dropdown',
                dropdown: 'tree.type'
            },
            validation: Joi.number().integer()
        },
        seedDescription: {
            title: 'Seed'
        },
        maleCone: {
            title: 'Male Cone'
        },
        femaleCone: {
            title: 'Female Cone'
        },
        flowerDescription: {
            title: 'Flower'
        },
        fruitName: {
            title: 'Fruit'
        }
    },
    cards: {
        edit: {
            title: 'Tree',
            properties: ['treeName', 'treeDescription', 'treeType']
        },
        reproduction: {
            title: 'Reproduction',
            properties: ['seedDescription', 'flowerDescription', 'fruitName']
        },
        taxonomy: {
            title: 'Taxonomy',
            properties: []
        },
        morphology: {
            title: 'Morphology',
            properties: []
        }
    }
};

export default tree;
