import { useState } from "react";

// Loading feature for buffering processes
const useLoading = () => {
    const [loading, setLoading] = useState(false);

    // Higher-order function to handle loading
    const withLoading =
        (asyncFunction) =>
        async (...args) => {
            setLoading(true);
            try {
                await asyncFunction(...args);
            } finally {
                setLoading(false);
            }
        };

    return { loading, withLoading };
};

export default useLoading;
