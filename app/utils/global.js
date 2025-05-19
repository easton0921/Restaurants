global.getErrorMessage = (err, processId = '') => {
    if (err.constructor.name !== 'Error') {
        err.message = 'Internal server error' //MSG.INTERNAL_ERROR_WITH_ID + processId;
    }
    return err.message;
};
