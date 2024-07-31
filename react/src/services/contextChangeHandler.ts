// react/src/services/contextChangeHandler.ts

type CallbackReturn = {
    allow: boolean;
    errorMessage?: string;
};

class ContextChangeHandler {
    private callbacks: Array<() => CallbackReturn>;

    constructor() {
        this.callbacks = [];
    }

    reset() {
        this.callbacks = [];
    }

    add(callback: () => CallbackReturn) {
        this.callbacks.push(callback);
    }

    execute(): { allow: boolean; errorMessage?: string } {
        let allow = true;
        let errorMessage: string | null = null;

        this.callbacks.forEach((callback) => {
            const callBackReturn = callback();
            allow = allow && callBackReturn.allow;
            if (!errorMessage && callBackReturn.errorMessage) {
                errorMessage = callBackReturn.errorMessage;
            }
        });

        if (errorMessage) {
            return { allow, errorMessage };
        }
        return { allow };
    }
}

export default ContextChangeHandler;
