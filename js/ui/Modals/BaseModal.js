/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    this.s_element = element
    this.element = element[0]
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.s_element.modal('show')
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.s_element.modal('hide')
  }
}