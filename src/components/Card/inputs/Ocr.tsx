/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import corePath from 'tesseract.js-core/tesseract-core.wasm.js';
import workerPath from 'tesseract.js/dist/worker.min.js';
import path from 'path';

import {FileUpload, Image, ProgressBar, type FileUploadProps} from '../../prime';

let worker;

export interface Props {
    ocr?: {
        update: string,
        threshold?: number,
        language?: 'eng' | 'mrz',
        match?: string,
        flags?: string
    },
    value?: unknown,
    basePath?: string;
    className: FileUploadProps['className'],
    setValue: (name: string, value: unknown) => void,
    onSelect: FileUploadProps['onSelect']
}

async function recognize(event, {threshold, language = 'eng', match, flags = 'ms'} : Props['ocr'], setProgress) {
    const url = URL.createObjectURL(event.files[0]);
    if (!worker) {
        const langPath = {
            eng: require('./eng.traineddata.gz').default,
            mrz: require('./mrz.traineddata.gz').default
        }[language];
        const Tesseract = await import('tesseract.js');
        const temp = Tesseract.createWorker({
            logger: data => {
                if (data.status === 'recognizing text') setProgress(Math.trunc(data.progress * 100));
            },
            langPath: path.dirname(langPath),
            workerPath,
            corePath
        });
        await temp.load();
        await temp.loadLanguage(path.basename(langPath, '.traineddata.gz'));
        await temp.initialize(path.basename(langPath, '.traineddata.gz'));
        worker = temp;
    }
    setProgress(0);
    const {data: {confidence, text}} = await worker.recognize(url);
    if (!threshold || confidence >= threshold) {
        if (match) {
            const found = text.match(new RegExp(match, flags));
            return found?.groups || found?.slice(flags?.includes('g') ? 0 : 1)?.join('\n');
        }
        return text;
    }
}

const headerTemplate = ({className, style, chooseButton}) => <div className={className} style={style}>{chooseButton}</div>;

const Ocr = React.forwardRef<ProgressBar, Props>(function Ocr({ocr, onSelect, setValue, className, value, ...props}, ref) {
    const [progress, setProgress] = React.useState(null);
    const handleSelect = React.useMemo(() => event => {
        recognize(event, ocr, setProgress).then(text => {
            ocr.update && setValue(ocr.update, text);
            return text;
        }).catch(console.error); // eslint-disable-line no-console
        return onSelect?.(event);
    }, [ocr, onSelect, setValue, setProgress]);

    let src = null;
    if (Array.isArray(value)) {
        src = value?.[0]?.objectURL;
    } else if (value) {
        src = (props.basePath || '') + value;
    }

    return <div className={className}>
        <FileUpload
            mode='advanced'
            headerTemplate={headerTemplate}
            {...props}
            onSelect={handleSelect}
            accept='image/*'
            multiple={false}
            itemTemplate={() => {
                return (
                    <Image
                        imageClassName='w-full'
                        preview
                        src={src}
                        {...(({basePath, ...rest}) => rest)(props)}
                    />
                );
            }}
            emptyTemplate={() => {
                return src ? <Image
                    imageClassName='w-full'
                    preview
                    src={src}
                    {...(({basePath, ...rest}) => rest)(props)}
                /> : <div>No picture...</div>;
            }}
        />
        {(progress < 100 && progress > 0) ? <ProgressBar value={progress} className='absolute bottom-0 left-50 right-0' ref={ref}/> : null}
    </div>;
});

export default Ocr;
