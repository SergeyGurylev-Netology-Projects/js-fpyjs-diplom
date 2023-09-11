/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  //static ACCESS_TOKEN = '';
  static lastCallback;

  static getToken(){
    let TOKEN = localStorage.getItem('VK_TOKEN');
    if (!TOKEN || String(TOKEN).trim() === '') {
      TOKEN = prompt('Введите токен ВКонтакте');
      localStorage.setItem('VK_TOKEN', TOKEN);
    }
    return TOKEN;
  }

  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    this.lastCallback = callback;

    const script = document.createElement('script');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&access_token=${this.getToken()}&v=5.131&callback=VK.processData`;
    script.id = 'vk-script';
    document.head.append(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    document.getElementById('vk-script').remove();

    const imagesArray = [];
    const sizesOrder = {'s': 0, 'm': 1, 'x': 2, 'o': 3, 'p': 4, 'q': 5, 'r': 6, 'y': 7, 'z': 8, 'w': 9};

    if (result.error) {
      alert(result.error.error_msg);
    } else {
      result.response.items.forEach(el => {
        let max = el.sizes.reduce((a, b) => a.height > b.height ? a : b);
        if (max.height === '0') max = el.sizes.reduce((a, b) => sizesOrder[a.type] > sizesOrder[b.type] ? a : b);

        imagesArray.push({
          'id': el.id,
          'date': el.date,
          'url': max.url
        });
      })
    }

    this.lastCallback.call(App.imageViewer, imagesArray);
    this.lastCallback = () => {}
  }
}
