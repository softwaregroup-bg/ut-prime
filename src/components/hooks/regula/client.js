/* eslint-disable camelcase */
import { eRPRM_Lights, eRPRM_ResultType } from './regula.sdk.enums';

const URLS = {
    CONNECT: '/Methods/Connect',
    DISCONNECT: '/Methods/Disconnect',
    GET_IMAGES: '/Methods/GetImages',
    GET_AVAILABLE_DEVICES: '/Methods/get_AvailableDevices',
    CHECK_READER_RESULT_JSON: '/Methods/CheckReaderResultJSON',
    IS_READER_RESULT_AVAILABLE: '/Methods/IsReaderResultTypeAvailable',
    NOTIFY_RFID_REQUEST_HANDLED: '/Events/NotifyRfidRequestHandled',
    NOTIFY_PORTRAIT_REQUEST_HANDLED: '/Events/NotifyPortraitRequestHandled'
};

export default class RegulaClient {
    constructor(url, disconnect) {
        this.url = url;
        this.disconnectCb = disconnect;
    }

    getUrl(path, params) {
        if (params) {
            params = new URLSearchParams(params);
            path = path + '?' + params.toString();
        }
        return `${this.url}${path}`;
    }

    connect = async() => {
        const { status: connectedStatus } = await fetch(
            this.getUrl(URLS.CONNECT),
            { method: 'post' }
        );
        if (connectedStatus !== 204) return false;
        const { status } = await this.getAvailableDevices();
        return status === 200;
    };

    disconnect = async() => {
        await fetch(this.getUrl(URLS.DISCONNECT), { method: 'post' });
        return true;
    };

    performScan = async() => {
        const { status } = await this.getAvailableDevices();
        if (status !== 200) {
            this.disconnectCb();
            return;
        }
        await fetch(this.getUrl(URLS.GET_IMAGES));
    };

    getAvailableDevices = (index = 0) => {
        return fetch(
            this.getUrl(URLS.GET_AVAILABLE_DEVICES, { Index: index })
        );
    };

    checkReaderResultChosenDocType = async(page) => {
        const response = await (
            await fetch(
                this.getUrl(
                    URLS.CHECK_READER_RESULT_JSON, {
                        AType: eRPRM_ResultType.RPRM_ResultType_ChosenDocumentTypeCandidate,
                        AIdx: page,
                        AOutput: 0
                    }
                )
            )
        ).json();
        const data = JSON.parse(response);
        const docClassMap = {
            'Identity Card': 'ID',
            Passport: 'P'
        };
        // {
        //     "OneCandidate": {
        //         "DocumentName": "Iraq - Passport (2006)"
        //     }
        // }
        return {
            type: docClassMap[data?.OneCandidate?.FDSIDList?.dDescription],
            template: data?.OneCandidate?.DocumentName
        };
    };

    getChosenDocType = async() => {
        const count = await (
            await fetch(
                this.getUrl(
                    URLS.IS_READER_RESULT_AVAILABLE, {
                        AType: eRPRM_ResultType.RPRM_ResultType_ChosenDocumentTypeCandidate
                    }
                )
            )
        ).text();
        const data = [];
        for (let i = 0; i < Number(count); i++) {
            const dataRes = await this.checkReaderResultChosenDocType(i);
            data.push(dataRes);
        }
        return data?.[0];
    };

    checkReaderResultImages = async(page) => {
        const response = await (
            await fetch(
                this.getUrl(
                    URLS.CHECK_READER_RESULT_JSON, {
                        AType: eRPRM_ResultType.RPRM_ResultType_Images,
                        AIdx: page,
                        AOutput: 0
                    }
                )
            )
        ).json();
        const data = JSON.parse(response);
        const docFrontSide = data?.Images?.fieldList?.find?.(
            (i) => i.fieldName === 'Document front side'
        );
        const front = docFrontSide?.valueList?.find?.(
            (item) =>
                item.lightIndex === eRPRM_Lights.RPRM_Light_White_Full &&
                item.pageIndex === 0
        )?.value;
        const back = docFrontSide?.valueList?.find?.(
            (item) =>
                item.lightIndex === eRPRM_Lights.RPRM_Light_White_Full &&
                item.pageIndex === 1
        )?.value;
        return [front, back].map(
            (pageImage) => pageImage && `data:image/jpg;base64,${pageImage}`
        );
    };

    getImages = () => {
        return this.checkReaderResultImages(0);
    };

    checkReaderResultText = async(page) => {
        const response = await (
            await fetch(
                this.getUrl(
                    URLS.CHECK_READER_RESULT_JSON, {
                        AType: eRPRM_ResultType.RPRM_ResultType_Text,
                        AIdx: page,
                        AOutput: 0
                    }
                )
            )
        ).json();
        const data = JSON.parse(response);
        return data?.Text?.fieldList?.reduce?.(
            (memo, next) => {
                const key = camelize(next.fieldName);
                const localizedKey = next.lcid !== 0 ? `${key}Local` : key; // trial and error logic..
                memo[localizedKey] = next.value;
                return memo;
            },
            { dateFormat: data?.Text?.dateFormat }
        );
    };

    getText = async(type, template) => {
        const count = await (
            await fetch(
                this.getUrl(
                    URLS.IS_READER_RESULT_AVAILABLE, {
                        AType: eRPRM_ResultType.RPRM_ResultType_Text
                    }
                )
            )
        ).text();
        const data = [];
        for (let i = 0; i < Number(count); i++) {
            const dataRes = await this.checkReaderResultText(i);
            data.push(dataRes);
        }
        return {
            documentClassCode: type,
            documentTemplate: template,
            ...data?.[0]
        };
    };

    checkReaderResultStatus = async(page) => {
        const response = await (
            await fetch(
                this.getUrl(
                    URLS.CHECK_READER_RESULT_JSON, {
                        AType: eRPRM_ResultType.RPRM_ResultType_Status,
                        AIdx: page,
                        AOutput: 0
                    }
                )
            )
        ).json();
        const data = JSON.parse(response);
        const item = data?.Status;
        const memo = {
            overallStatus: item?.overallStatus === 1,
            expiry: item?.detailsOptical?.expiry === 1,
            documentType: item?.detailsOptical?.docType === 1,
            textFields: item?.detailsOptical?.text === 1,
            mrz: item?.detailsOptical?.mrz === 1,
            imageQuality: item?.detailsOptical?.imageQA === 1
            // ImageQualityCheckList tag contains more about imageQuality
        };

        memo.statusRaw = item;
        return memo;
    };

    getAllStatuses = async() => {
        const count = await (
            await fetch(
                this.getUrl(
                    URLS.IS_READER_RESULT_AVAILABLE, {
                        AType: eRPRM_ResultType.RPRM_ResultType_Status
                    }
                )
            )
        ).text();
        const data = [];
        for (let i = 0; i < Number(count); i++) {
            const dataRes = await this.checkReaderResultStatus(i);
            data.push(dataRes);
        }
        return data?.[0];
    };

    getResult = async() => {
        const { status: deviceStatus } = await this.getAvailableDevices();
        if (deviceStatus !== 200) {
            this.disconnectCb();
            return;
        }
        const {
            type,
            template
        } = await this.getChosenDocType();
        const images = await this.getImages();
        const text = await this.getText(type, template);
        const status = await this.getAllStatuses();

        const result = {
            images,
            text,
            status
        };

        // here we can check the documentTemplate
        // and based on it tweak statuses:
        // Barcode, RFID, overallstatus etc.

        return result;
    };

    notifyRfidRequestHandled = async() => {
        await fetch(this.getUrl(URLS.NOTIFY_RFID_REQUEST_HANDLED), {
            method: 'POST',
            headers: {
                contentType: 'application/json; charset=utf-8'
            }
        });
    };

    notifyPortraitRequestHandled = async() => {
        await fetch(this.getUrl(URLS.NOTIFY_PORTRAIT_REQUEST_HANDLED), {
            method: 'POST',
            headers: {
                contentType: 'application/json; charset=utf-8'
            }
        });
    };
}

function camelize(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
}
