export default content => content?.trim().split(/\r?\n/).reduce((prev, cur, index) => {
    const [dictionaryKey, translatedValue] = cur.trim().split('=');
    if (dictionaryKey && translatedValue) prev[dictionaryKey] = translatedValue;
    return prev;
}, {});
