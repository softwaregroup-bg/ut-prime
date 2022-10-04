import type {Schema, Cards} from '../types';

const document: {schema: Schema, cards: Cards} = {
    schema: {
        properties: {
            document: {
                properties: {
                    image: {
                        title: 'Scanned document',
                        widget: {
                            type: 'ocr',
                            ocr: {
                                update: 'document.text',
                                match: '^.*<.*$',
                                flags: 'mg'
                            }
                        }
                    },
                    text: {
                        title: 'Recognized text from MRZ',
                        widget: {
                            type: 'text'
                        }
                    }
                }
            }
        }
    },
    cards: {
        edit: {
            widgets: ['document.image', 'document.text']
        }
    }
};

export default document;
