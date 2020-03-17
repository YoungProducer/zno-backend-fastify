"use strict";
/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 10 March 2020
 *
 * Custom error handler to handle json stringified errors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = (error) => {
    try {
        let parsedMessage;
        if (error.message) {
            parsedMessage = JSON.parse(error.message);
        }
        if (parsedMessage.message) {
            error.message = parsedMessage.message;
        }
        return {
            error,
            data: parsedMessage.errorData || undefined,
        };
    }
    catch (e) {
        return error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zZXJ2aWNlcy9lcnJvci1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRzs7QUFJVSxRQUFBLFlBQVksR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFO0lBQ3ZDLElBQUk7UUFDQSxJQUFJLGFBQWEsQ0FBQztRQUNsQixJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDZixhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDN0M7UUFDRCxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUU7WUFDdkIsS0FBSyxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO1NBQ3pDO1FBRUQsT0FBTztZQUNILEtBQUs7WUFDTCxJQUFJLEVBQUUsYUFBYSxDQUFDLFNBQVMsSUFBSSxTQUFTO1NBQzdDLENBQUM7S0FDTDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1IsT0FBTyxLQUFLLENBQUM7S0FDaEI7QUFDTCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnk6IE9sZWtzYW5kciBCZXpydWtvdlxuICogQ3JlYXRpb24gZGF0ZTogMTAgTWFyY2ggMjAyMFxuICpcbiAqIEN1c3RvbSBlcnJvciBoYW5kbGVyIHRvIGhhbmRsZSBqc29uIHN0cmluZ2lmaWVkIGVycm9ycy5cbiAqL1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgY29uc3QgZXJyb3JIYW5kbGVyID0gKGVycm9yOiBhbnkpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBsZXQgcGFyc2VkTWVzc2FnZTtcbiAgICAgICAgaWYgKGVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHBhcnNlZE1lc3NhZ2UgPSBKU09OLnBhcnNlKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJzZWRNZXNzYWdlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSBwYXJzZWRNZXNzYWdlLm1lc3NhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICBkYXRhOiBwYXJzZWRNZXNzYWdlLmVycm9yRGF0YSB8fCB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgfVxufTtcbiJdfQ==