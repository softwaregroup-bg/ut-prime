import Joi from 'joi';
import type {Schema, Cards} from '../types';

const tree: {schema: Schema, cards: Cards} = {
    schema: {
        properties: {
            tree: {
                properties: {
                    treeId: {
                        validation: Joi.number().integer()
                    },
                    treeName: {
                        title: 'Name'
                    },
                    treeDescription: {
                        title: 'Description',
                        widget: {
                            type: 'text'
                        }
                    },
                    treeType: {
                        title: 'Type',
                        widget: {
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
                    },
                    habitat: {
                        validation: Joi.array().items(Joi.number().integer()),
                        widget: {
                            type: 'multiSelectPanel',
                            dropdown: 'tree.habitat'
                        }
                    }
                }
            }
        }
    },
    cards: {
        edit: {
            label: 'Tree',
            widgets: ['tree.treeName', 'tree.treeDescription', 'tree.treeType']
        },
        reproduction: {
            label: 'Reproduction',
            widgets: ['tree.seedDescription', 'tree.flowerDescription', 'tree.fruitName']
        },
        taxonomy: {
            label: 'Taxonomy',
            widgets: []
        },
        morphology: {
            label: 'Morphology',
            widgets: []
        },
        habitat: {
            label: 'Habitat',
            widgets: ['tree.habitat']
        }
    }
};

export default tree;
