# Whatsapp / Telegram Contact Button by Evgeny Kuznetsov (JetStyle/DataHints)

Плавающий виджет контактов для WordPress и GTM, который автоматически передает ClientId из Яндекс Метрики (`_ym_uid`) в ссылки на Telegram и WhatsApp для идентификации посетителей в CRM-системе.

## Описание

Виджет добавляет на сайт анимированную плавающую кнопку с быстрым доступом к Telegram и WhatsApp. При клике на кнопку контактов автоматически передается уникальный идентификатор посетителя из Яндекс Метрики, что позволяет отслеживать источник обращения и связывать его с данными аналитики.

### Основные возможности

- ✅ Автоматическое получение `_ym_uid` из cookie Яндекс Метрики
- ✅ Передача ClientId в Telegram-бот через параметр `start`
- ✅ Передача ClientId в WhatsApp через шаблон сообщения
- ✅ Адаптивный дизайн для мобильных устройств
- ✅ Анимации и плавные переходы
- ✅ Поддержка accessibility (ARIA-атрибуты)
- ✅ Два способа установки: WordPress плагин или GTM сниппет

## Установка

### Вариант 1: WordPress плагин

1. Скачайте или клонируйте репозиторий
2. Загрузите папку `wa-tg-contact-button` в директорию `/wp-content/plugins/`
3. Активируйте плагин в админ-панели WordPress: **Плагины → Установленные плагины → DataHints Contact Button → Активировать**

Плагин автоматически подключит необходимые CSS и JS файлы и выведет виджет в футере сайта.

### Вариант 2: GTM сниппет

1. Откройте Google Tag Manager
2. Создайте новый тег типа **Custom HTML**
3. Скопируйте содержимое файла `gtm-widget-snippet.html`
4. Вставьте код в поле тега
5. Настройте триггер для загрузки на всех страницах (или нужных вам)
6. Сохраните и опубликуйте изменения

## Настройка

### Telegram

По умолчанию виджет использует бота `@datahints_bot`. Чтобы изменить бота, отредактируйте константу `TELEGRAM_URL` в файле:

- **WordPress**: `wa-tg-contact-button/assets/js/widget.js` (строка 2)
- **GTM**: `gtm-widget-snippet.html` (строка 185)

```javascript
const TELEGRAM_URL = 'https://t.me/ваш_бот?start=';
```

### WhatsApp

#### Изменение номера телефона

Отредактируйте константу `WHATSAPP_DEFAULT_PHONE`:

- **WordPress**: `wa-tg-contact-button/assets/js/widget.js` (строка 4)
- **GTM**: `gtm-widget-snippet.html` (строка 187)

```javascript
const WHATSAPP_DEFAULT_PHONE = '79991234567'; // Формат: только цифры, без + и пробелов
```

#### Изменение шаблона сообщения

Отредактируйте константу `WHATSAPP_MESSAGE_TEMPLATE`:

- **WordPress**: `wa-tg-contact-button/assets/js/widget.js` (строка 5)
- **GTM**: `gtm-widget-snippet.html` (строка 188)

```javascript
const WHATSAPP_MESSAGE_TEMPLATE = 'Ваш текст сообщения. ClientId: {clientId}';
```

Плейсхолдер `{clientId}` будет автоматически заменен на значение `_ym_uid` или fallback-значение.

### Fallback значение

Если `_ym_uid` не найден (например, Яндекс Метрика еще не загрузилась), используется fallback-значение:

- **WordPress**: `wa-tg-contact-button/assets/js/widget.js` (строка 6) — по умолчанию `'4-8-15-16-23-42'`
- **GTM**: `gtm-widget-snippet.html` (строка 189) — по умолчанию `'4-8-15-16-23-42'`

Виджет также пытается получить `_ym_uid` повторно в течение 10 секунд (5 попыток по 2 секунды), если cookie изначально не был найден.

## Как это работает

1. При загрузке страницы виджет ищет cookie `_ym_uid` (устанавливается Яндекс Метрикой)
2. Если cookie найден, его значение используется как ClientId
3. ClientId передается в ссылки:
   - **Telegram**: `https://t.me/бот?start={clientId}`
   - **WhatsApp**: добавляется в текст сообщения как `{clientId}`
4. При клике пользователя на кнопку контактов открывается мессенджер с уже заполненным ClientId
5. В CRM-системе (например, Wazzup) можно связать обращение с данными аналитики по этому идентификатору

## Структура файлов

```
datahints-contact-button/
├── wa-tg-contact-button/          # Папка WordPress плагина
│   ├── datahints-contact-button.php    # Основной файл плагина
│   └── assets/
│       ├── css/
│       │   └── widget.css            # Стили виджета
│       └── js/
│           └── widget.js              # JavaScript логика (WordPress версия)
├── gtm-widget-snippet.html        # Готовый сниппет для GTM
├── LICENSE                        # Лицензия
└── README.md                      # Этот файл
```

## Требования

- WordPress 5.0+ (для плагина)
- Яндекс Метрика установлена на сайте (для получения `_ym_uid`)
- Современный браузер с поддержкой ES6+ (для GTM версии)

## Кастомизация

### Изменение позиции кнопки

Отредактируйте CSS в файле `wa-tg-contact-button/assets/css/widget.css` или в `<style>` блоке GTM сниппета:

```css
#datahints-contact-button {
    bottom: 24px;  /* Отступ снизу */
    right: 24px;   /* Отступ справа */
}
```

### Изменение цветов

Цвета кнопок задаются через градиенты в CSS:

```css
/* Telegram */
.datahints-contact-button__item--telegram {
    background: linear-gradient(135deg, #37aee2 0%, #1e96c8 100%);
}

/* WhatsApp */
.datahints-contact-button__item--whatsapp {
    background: linear-gradient(135deg, #43d854 0%, #009688 100%);
}
```

### Отключение анимации переключения главной кнопки

В JavaScript найдите блок с `setInterval` и удалите или закомментируйте его:

```javascript
// Закомментируйте этот блок, чтобы отключить автоматическое переключение
/*
setInterval(() => {
    const nextIndex = (activeStateIndex + 1) % mainStates.length;
    applyMainState(nextIndex);
}, 4000);
*/
```

## Отладка

### Проверка работы виджета

1. Откройте консоль браузера (F12)
2. Проверьте наличие cookie `_ym_uid`: `document.cookie`
3. Проверьте наличие элемента на странице: `document.getElementById('datahints-contact-button')`
4. Проверьте ссылки в кнопках: наведите курсор на кнопки Telegram/WhatsApp и посмотрите href в инструментах разработчика

### Частые проблемы

**Виджет не появляется:**
- Убедитесь, что плагин активирован (WordPress) или тег опубликован (GTM)
- Проверьте, нет ли конфликтов с другими плагинами/скриптами
- Проверьте консоль браузера на наличие ошибок JavaScript

**ClientId не передается:**
- Убедитесь, что Яндекс Метрика установлена и работает на сайте
- Проверьте, что cookie `_ym_uid` присутствует: `document.cookie.includes('_ym_uid')`
- Подождите несколько секунд — виджет пытается получить cookie повторно

**Стили не применяются:**
- Проверьте, что CSS файлы загружаются (вкладка Network в DevTools)
- Убедитесь, что нет конфликтов с темами WordPress
- Проверьте z-index — возможно, другие элементы перекрывают кнопку

## Лицензия

См. файл [LICENSE](LICENSE)

## Автор

Evgeny Kuznetsov (Full Stack Data Analyst at JetStyle) / DataHints

## Версия

1.0.0

---

**Примечание**: Для корректной работы виджета необходимо, чтобы на сайте была установлена и активна Яндекс Метрика, которая создает cookie `_ym_uid` для идентификации посетителей.

