import type {Schema, Cards} from '../types';

const tree: {schema: Schema, cards: Cards} = {
    schema: {
        properties: {
            tree: {
                required: ['treeName'],
                properties: {
                    treeId: {
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
                        }
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
                    mock: {
                        title: 'នៅក្រោមដើមឈើ'
                    },
                    udf: {
                        type: 'object',
                        udf: true
                    },
                    habitat: {
                        title: '',
                        widget: {
                            type: 'multiSelectPanel',
                            dropdown: 'tree.habitat'
                        }
                    },
                    links: {
                        title: '',
                        widget: {
                            type: 'table'
                        },
                        items: {
                            properties: {
                                title: {},
                                url: {}
                            }
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
        links: {
            label: 'Links',
            widgets: [{
                name: 'tree.links',
                widgets: ['title', 'url']
            }]
        },
        habitat: {
            label: 'Habitat',
            widgets: ['tree.habitat']
        }
    }
};

export default tree;
