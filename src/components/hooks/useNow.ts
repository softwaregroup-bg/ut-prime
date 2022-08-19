import { useState } from 'react';

export default function useNow() {
    const [, update] = useState(Date.now());
    return () => update(Date.now());
}
