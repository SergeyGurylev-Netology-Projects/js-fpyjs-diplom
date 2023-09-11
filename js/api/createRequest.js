/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;

    xhr.responseType = 'json';
    xhr.addEventListener('load', e => options.callback(e.target.response))
    xhr.open(options.method, Yandex.HOST + options.uri + (options.params ? '?'+options.params.join('&') : ''));
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `OAuth ${Yandex.getToken()}`);
    xhr.send();
};
