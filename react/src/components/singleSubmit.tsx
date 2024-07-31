import React, { useState, useEffect } from 'react';

interface SingleSubmitProps {
    singleSubmit: () => Promise<any>;
}

const SingleSubmit: React.FC<SingleSubmitProps> = ({ singleSubmit }) => {
    const [ignoreSubmit, setIgnoreSubmit] = useState(false);

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        if (ignoreSubmit) {
            return;
        }
        setIgnoreSubmit(true);
        try {
            await singleSubmit();
        } finally {
            setIgnoreSubmit(false);
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup if needed when component is unmounted
        };
    }, []);

    return (
        <form onSubmit={submitHandler}>

            <div>
                <label htmlFor="inputField">Input Field:</label>
                <input type="text" id="inputField" name="inputField" required />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default SingleSubmit;
