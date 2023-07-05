/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import ReactWebcam, { type WebcamProps } from 'react-webcam';
import merge from 'ut-function.merge';

import { Image, Button } from '../../prime';
import Text from '../../Text';

export interface Props {
    videoConstraints?: WebcamProps['videoConstraints'];
    value?: string | File[];
    basePath?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (event: { value: File[] }) => void;
}

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: 'image/png' });
}

function fileToDataUrl(file: File) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        if (file) {
            reader.readAsDataURL(file);
        }
    });
}

const defaultVideoConstraints = {
    width: 1280,
    height: 720,
    facingMode: { ideal: 'environment' }
};

function Webcam({ className, value, onChange, basePath, videoConstraints: vcProps, disabled, ...props }: Props) {
    const [images, setImages] = React.useState([]);
    const [edit, setEdit] = React.useState(false);
    const [preview, setPreview] = React.useState(null);
    const webcamRef = React.useRef(null);
    const videoConstraints = React.useRef(merge(defaultVideoConstraints, vcProps));
    React.useEffect(() => {
        if (!value) return;
        if (typeof value[0] === 'string') {
            setPreview(`${basePath}${value[0]}`);
            return;
        }
        fileToDataUrl(value[0]).then(setPreview).catch();
    }, [value, basePath]);
    React.useEffect(() => {
        videoConstraints.current = merge(defaultVideoConstraints, vcProps);
    }, [vcProps]);
    const capture = React.useCallback(async() => {
        const src = webcamRef.current.getScreenshot();
        const file = await dataUrlToFile(src, 'webcam-image.png');
        setImages((prev) => [{ file, src }, ...prev.slice(0, 2)]);
    }, [webcamRef]);
    const handleEdit = () => {
        setEdit(true);
    };
    const handleClose = () => {
        setEdit(false);
    };
    const handleChoose = (file) => (e) => {
        onChange({ ...e, value: [file] });
        setEdit(false);
    };
    return (
        <div className={className}>
            <div className="p-3 border-1 border-solid surface-border border-round-top surface-ground flex justify-content-between">
                <Button
                    disabled={disabled}
                    onClick={handleEdit}
                >
                    Edit
                </Button>
                {edit ? (
                    <Button
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                ) : null}
            </div>
            {edit && !disabled ? (
                <div className="p-3 border-1 border-solid border-top-none surface-border border-round-bottom">
                    <ReactWebcam
                        audio={false}
                        ref={webcamRef}
                        minScreenshotHeight={videoConstraints.current.height}
                        minScreenshotWidth={videoConstraints.current.width}
                        screenshotFormat="image/png"
                        className="w-full"
                        videoConstraints={videoConstraints.current}
                        {...props}
                    />
                    <Button className="mt-3" onClick={capture}>
                        Capture photo
                    </Button>
                    <div className="grid mt-3">
                        {images.map(({ file, src }, i) => (
                            <div className="col-12 md:col-4 relative" key={i}>
                                <Image imageClassName="w-full" preview src={src} />
                                <Button
                                    className="absolute bottom-0 right-0"
                                    icon="pi pi-check"
                                    tooltip="Choose"
                                    onClick={handleChoose(file)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-3 border-1 border-solid border-top-none surface-border border-round-bottom">
                    {value ? (
                        <Image imageClassName="w-full" preview src={preview} />
                    ) : (
                        <div className="py-3">
                            <Text>No picture...</Text>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Webcam;
