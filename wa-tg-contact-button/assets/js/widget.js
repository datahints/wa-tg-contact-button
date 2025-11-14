(function () {
    const TELEGRAM_URL = 'https://t.me/datahints_bot?start=';
    const WHATSAPP_BASE_URL = 'https://api.whatsapp.com/send/';
    const WHATSAPP_DEFAULT_PHONE = '73433848481';
    const WHATSAPP_MESSAGE_TEMPLATE = 'Добрый день, у меня есть вопрос... (Номер моего обращения:{clientId}, пожалуйста не удаляйте этот текст).';
    const CLIENT_ID_FALLBACK = '4-8-15-16-23-42';

    const container = document.getElementById('datahints-contact-button');
    if (!container) {
        return;
    }

    const readCookie = (name) => {
        const cookieString = document.cookie;
        if (!cookieString) {
            return null;
        }

        const cookies = cookieString.split(';');
        for (let i = 0; i < cookies.length; i += 1) {
            const cookie = cookies[i];
            if (!cookie) {
                continue;
            }

            const separatorIndex = cookie.indexOf('=');
            if (separatorIndex === -1) {
                continue;
            }

            const rawKey = cookie.slice(0, separatorIndex).trim();
            if (rawKey !== name) {
                continue;
            }

            const rawValue = cookie.slice(separatorIndex + 1);
            return decodeURIComponent(rawValue);
        }
        return null;
    };

    const getClientId = () => {
        const ymUid = readCookie('_ym_uid');
        return ymUid && ymUid.trim() ? ymUid.trim() : null;
    };

    const getClientIdOrFallback = () => {
        const clientId = getClientId();
        return clientId || CLIENT_ID_FALLBACK;
    };

    const buildTelegramHref = (clientId) => {
        return `${TELEGRAM_URL}${encodeURIComponent(clientId)}`;
    };

    const buildWhatsappHref = (clientId) => {
        const params = new URLSearchParams({
            phone: WHATSAPP_DEFAULT_PHONE,
            text: WHATSAPP_MESSAGE_TEMPLATE.replace('{clientId}', clientId),
            type: 'phone_number',
            app_absent: '0'
        });
        return `${WHATSAPP_BASE_URL}?${params.toString()}`;
    };

    const updateLinks = (clientId) => {
        const actualClientId = clientId || CLIENT_ID_FALLBACK;
        const telegramHref = buildTelegramHref(actualClientId);
        const whatsappHref = buildWhatsappHref(actualClientId);

        const telegramLink = container.querySelector('.datahints-contact-button__item--telegram');
        const whatsappLink = container.querySelector('.datahints-contact-button__item--whatsapp');

        if (telegramLink) {
            telegramLink.href = telegramHref;
        }
        if (whatsappLink) {
            whatsappLink.href = whatsappHref;
        }
    };

    const clientId = getClientId();
    const clientIdForLinks = getClientIdOrFallback();
    const telegramHref = buildTelegramHref(clientIdForLinks);
    const whatsappHref = buildWhatsappHref(clientIdForLinks);

    const telegramSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="presentation" aria-hidden="true">
            <path d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0zm55.5 80.2l-20.6 97.2c-1.6 7.1-5.9 8.9-12 5.6l-32.9-24.2-15.8 15.2c-1.7 1.7-3.2 3.2-6.5 3.2l2.3-33.3 60.6-54.7c2.6-2.3-0.6-3.6-4-1.3L94 141.5l-31.6-9.9c-6.9-2.2-7-6.9 1.4-10.2l123.7-47.7c5.6-2.1 10.5 1.3 8 9.5z"/>
        </svg>
    `;

    const whatsappSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" role="presentation" aria-hidden="true">
            <path d="M120 0C53.8 0 0 53.8 0 120c0 21.2 5.6 41.7 16.1 59.7L8 232l53.6-8c17.3 9.4 36.8 14.3 58.4 14.3 66.2 0 120-53.8 120-120S186.2 0 120 0zm70.4 170.1c-2.9 8.2-16.9 15.6-23.8 16.1-6.1.5-13.8.8-22.3-1.4-5.1-1.2-11.7-3.8-20.2-7.5-35.5-15.4-58.6-51.2-60.4-53.6-1.8-2.4-14.4-19.2-14.4-36.6S58.1 56 61 50.7c2.9-5.3 6.4-7.5 8.6-7.5 2.2 0 4.3 0 6.1.1 2 .1 4.6-.7 7.2 5.5 2.9 6.9 9.8 23.9 10.7 25.6.9 1.7 1.5 3.7.3 6.1-1.2 2.4-1.8 3.8-3.5 5.8-1.7 2-3.6 4.5-5.1 6.1-1.7 1.7-3.5 3.6-1.5 7 1.9 3.5 8.5 14 18.2 22.7 12.5 11.1 22.9 14.6 26.2 16.3 3.3 1.7 5.2 1.4 7.1-.9 2.2-2.6 5-6.2 7.9-10 2-2.7 4.5-3.1 7.2-2.1 2.7 1 17.1 8.1 20.1 9.6 2.9 1.5 4.8 2.2 5.5 3.4.7 1.2.7 7.1-2.2 15.3z"/>
        </svg>
    `;

    container.innerHTML = `
        <a class="datahints-contact-button__item datahints-contact-button__item--telegram" href="${telegramHref}" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram">${telegramSVG}</a>
        <a class="datahints-contact-button__item datahints-contact-button__item--whatsapp" href="${whatsappHref}" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp">${whatsappSVG}</a>
        <button type="button" class="datahints-contact-button__main" aria-expanded="false" aria-label="Открыть контакты"></button>
    `;

    if (!clientId) {
        let checkAttempts = 0;
        const maxAttempts = 5;
        const checkInterval = 2000;

        const cookieCheckInterval = setInterval(() => {
            checkAttempts += 1;
            const newClientId = getClientId();

            if (newClientId) {
                clearInterval(cookieCheckInterval);
                updateLinks(newClientId);
            } else if (checkAttempts >= maxAttempts) {
                clearInterval(cookieCheckInterval);
            }
        }, checkInterval);
    }

    const mainButton = container.querySelector('.datahints-contact-button__main');
    const mainStates = [
        {
            name: 'telegram',
            className: 'datahints-contact-button__main--telegram',
            icon: telegramSVG
        },
        {
            name: 'whatsapp',
            className: 'datahints-contact-button__main--whatsapp',
            icon: whatsappSVG
        }
    ];

    const mainStateClassList = mainStates.map((state) => state.className);
    let activeStateIndex = 0;

    const applyMainState = (index) => {
        if (!mainButton) {
            return;
        }

        const state = mainStates[index];
        if (!state) {
            return;
        }

        activeStateIndex = index;
        mainButton.innerHTML = state.icon;
        mainButton.classList.remove(...mainStateClassList);
        mainButton.classList.add(state.className);
        mainButton.setAttribute('data-active-contact', state.name);
    };

    if (mainButton) {
        applyMainState(0);

        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
            setInterval(() => {
                const nextIndex = (activeStateIndex + 1) % mainStates.length;
                applyMainState(nextIndex);
            }, 4000);
        }
    }
    const toggleOpen = (forceValue) => {
        const isOpen = forceValue !== undefined ? forceValue : !container.classList.contains('datahints-contact-button--open');
        container.classList.toggle('datahints-contact-button--open', isOpen);
        if (mainButton) {
            mainButton.setAttribute('aria-expanded', String(isOpen));
        }
    };

    if (mainButton) {
        mainButton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleOpen();
        });

        mainButton.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                toggleOpen(false);
                return;
            }

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleOpen();
            }
        });
    }

    document.addEventListener('click', (event) => {
        if (!container.contains(event.target)) {
            toggleOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleOpen(false);
        }
    });
})();

