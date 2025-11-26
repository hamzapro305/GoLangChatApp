const Debounce = 
<T extends (...args: any[]) => void>(callback: T, wait: number): (...args: Parameters<T>) => void => {
    let timeoutId: number | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
};

export default Debounce;
