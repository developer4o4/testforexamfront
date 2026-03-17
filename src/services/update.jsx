// services/updateData.js

export const updateData = async (url, data = {}, options = {}) => {
    try {
        const response = await fetch(url, {
            method: 'PUT', // yoki PATCH bo'lishi mumkin API'ga qarab
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            body: JSON.stringify(data),
            ...options
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || `Tahrirlashda xatolik: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('updateData xatosi:', error);     
        throw error;
    }
};
