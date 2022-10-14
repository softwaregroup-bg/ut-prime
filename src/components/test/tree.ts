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
                            onChange: 'handleFieldChange',
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
                    },
                    picture: {
                        widget: {type: 'file'}
                    },
                    icon: {
                        widget: {type: 'file'}
                    },
                    documents: {
                        widget: {
                            type: 'table',
                            widgets: ['title', 'attachment']
                        },
                        items: {
                            properties: {
                                title: {},
                                attachment: {
                                    widget: {type: 'file'}
                                }
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
        files: {
            widgets: ['tree.treeName', 'tree.treeDescription', 'tree.picture', 'tree.icon', 'tree.documents']
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
