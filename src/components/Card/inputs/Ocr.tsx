import React from 'react';

import {FileUpload, ProgressBar, type FileUploadProps} from '../../prime';

let Tesseract;

export interface Props {
    ocr?: {
        update: string,
        threshold?: number,
        language?: string,
        match?: string,
        flags?: string
    },
    value?: unknown,
    className: FileUploadProps['className'],
    setValue: (name: string, value: unknown) => void,
    onSelect: FileUploadProps['onSelect']
}

async function recognize(event, {threshold, language = 'eng', match, flags = 'ms'} : Props['ocr'], setProgress) {
    const url = URL.createObjectURL(event.files[0]);
    if (!Tesseract) Tesseract = await import('tesseract.js');
    setProgress(0);
    const {data: {confidence, text}} = await Tesseract.recognize(
        url,
        language, {
            logger: data => {
                if (data.status === 'recognizing text') setProgress(Math.trunc(data.progress * 100));
            }
        });
    if (!threshold || confidence >= threshold) {
        if (match) {
            const found = text.match(new RegExp(match, flags));
            return found?.groups || found?.slice(flags?.includes('g') ? 0 : 1)?.join('\n');
        }
        return text;
    }
}

const itemTemplate = (file, props) => {
    return (
        <div className="flex align-items-center flex-wrap">
            <img alt={file.name} role="presentation" src={file.objectURL} className='w-full' />
        </div>
    );
};

const headerTemplate = ({className, style, chooseButton}) => <div className={className} style={style}>{chooseButton}</div>;

const Ocr = ({ocr, onSelect, setValue, className, value, ...props}: Props) => {
    const [progress, setProgress] = React.useState(null);
    const handleSelect = React.useMemo(() => event => {
        recognize(event, ocr, setProgress).then(text => {
            ocr.update && setValue(ocr.update, text);
            return text;
        }).catch(console.error); // eslint-disable-line no-console
        return onSelect?.(event);
    }, [ocr, onSelect, setValue, setProgress]);
    return <div className={className}>
        <FileUpload
            mode='advanced'
            itemTemplate={itemTemplate}
            headerTemplate={headerTemplate}
            {...props}
            onSelect={handleSelect}
        />
        {(progress < 100 && progress > 0) ? <ProgressBar value={progress} className='absolute bottom-0 left-50 right-0' /> : null}
    </div>;
};

export default Ocr;