// services/deleteData.js
export const deleteData = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            ...options
        });

        if (!response.ok) {
            const errorData = await response.message;
            throw new Error(errorData?.message || `O'chirishda xatolik: ${response.status}`);
        }

        return await response.message;
    } catch (error) {
        console.error('deleteData xatosi:', error);
        throw error;
    }
};