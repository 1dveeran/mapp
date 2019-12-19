/**
 * request network request tool
  * More detailed api documentation: https://github.com/umijs/umi-request
 */
import {extend} from 'umi-request';
import {notification} from 'antd';

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'The data was deleted successfully.',
  400: 'The request was made with an error and the server did not perform any operations to create or modify data.',
  401: 'The user does not have permission (token, username, password is incorrect). ',
  403: 'User is authorized, but access is forbidden. ',
  404: 'The request sent is for a record that does not exist and the server is not operating. ',
  406: 'The format of the request is not available. ',
  410: 'The requested resource is permanently deleted and will not be obtained again. ',
  422: 'When creating an object, a validation error occurred. ',
  500: 'The server has an error. Please check the server. ',
  502: 'Gateway error. ',
  503: 'The service is unavailable, the server is temporarily overloaded or maintained. ',
  504: 'The gateway timed out. ',
};

/**
 * Exception handler
 */
const errorHandler = (error: { response: Response }): Response => {
  const {response} = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const {status, url} = response;

    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  }
  return response;
};

/**
 * Default parameters when configuring request request
 */
const request = extend({
  errorHandler, // default error handling
  credentials: 'include', // whether the default request carries a cookie
});

export default request;
