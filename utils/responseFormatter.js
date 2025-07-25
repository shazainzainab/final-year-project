/**
 * Utility functions for formatting API responses consistently
 */

class ResponseFormatter {
    /**
     * Success response format
     * @param {Object} res - Express response object
     * @param {*} data - Response data
     * @param {string} message - Success message
     * @param {number} statusCode - HTTP status code
     */
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Error response format
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {*} error - Error details
     * @param {number} statusCode - HTTP status code
     */
    static error(res, message = 'Internal Server Error', error = null, statusCode = 500) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (error && process.env.NODE_ENV === 'development') {
            response.error = error;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Validation error response
     * @param {Object} res - Express response object
     * @param {*} validationErrors - Validation error details
     */
    static validationError(res, validationErrors) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationErrors,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Not found response
     * @param {Object} res - Express response object
     * @param {string} resource - Resource that was not found
     */
    static notFound(res, resource = 'Resource') {
        return res.status(404).json({
            success: false,
            message: `${resource} not found`,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Unauthorized response
     * @param {Object} res - Express response object
     * @param {string} message - Custom message
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Forbidden response
     * @param {Object} res - Express response object
     * @param {string} message - Custom message
     */
    static forbidden(res, message = 'Access forbidden') {
        return res.status(403).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = ResponseFormatter;