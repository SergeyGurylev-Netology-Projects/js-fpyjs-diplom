/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
    let TOKEN = localStorage.getItem('Yandex_TOKEN');
    if (!TOKEN || String(TOKEN).trim() === '') {
      TOKEN = prompt('Введите токен Яднекс.Диска');
      localStorage.setItem('Yandex_TOKEN', TOKEN);
    }
    return TOKEN;
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    createRequest({
      method: 'POST',
      uri: '/resources/upload',
      params: [
        `path=${path}`,
        `url=${url}`
      ],
      callback: callback
    });
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    createRequest({
      method: 'DELETE',
      uri: '/resources',
      params: [
        `path=${path}`
      ],
      callback: callback
    });
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    createRequest({
      method: 'GET',
      // uri: '/resources/files',
      uri: '/resources/last-uploaded',
      params: [
          'media_type=image'
      ],
      callback: callback
    });
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url){
    let link_url = document.createElement('a');
    link_url.href = url;
    document.head.appendChild(link_url);
    link_url.click();
    document.head.removeChild(link_url);
   }
}
