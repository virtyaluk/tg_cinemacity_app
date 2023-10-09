/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import localforage from 'localforage';
import { getItem, setItem } from './TgCloudStorage';
import { Telegram, WebApp, WebApp as WebAppTypes } from '../../../shared';

type Nullable<T> = T | null | undefined;
type HandlerFunction = () => void;

const telegramWindow = window as unknown as Window & { Telegram: Telegram };
const WebApp: WebAppTypes = telegramWindow.Telegram.WebApp;

interface MainBtnParams {
    color?: string;
    text?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
}

class AppMainButton {
    public clickHandlerFn: Nullable<HandlerFunction> = null;
    private tgMainBtn = WebApp.MainButton;

    private setTextHandler: Nullable<(text: string) => void> = null;
    private setVisibilityHandler: Nullable<(visible: boolean) => void> = null;
    private setDisabilityHandler: Nullable<(isDisabled: boolean) => void> = null;
    private setTextColorHandler: Nullable<(color: string) => void> = null;
    private setColorHandler: Nullable<(color: string) => void> = null;

    public constructor() {
        this.tgMainBtn.onClick(() => this.onClickHandler());
    }

    public on(fn: HandlerFunction): AppMainButton {
        console.debug('AppMainButton::on');

        this.clickHandlerFn = fn;

        return this;
    }

    public off(): AppMainButton {
        this.clickHandlerFn = null;

        return this;
    };

    public setText(text: string): AppMainButton {
        console.debug('AppMainButton::setText', text);

        this.tgMainBtn.setText(text);
        this.setTextHandler && this.setTextHandler(text);

        return this;
    }

    public setVisibility(isVisible: boolean): AppMainButton {
        if (isVisible) {
            this.show();
        } else {
            this.hide();
        }

        return this;
    }

    public setDisability(isDisabled: boolean): AppMainButton {
        console.debug('AppMainButton::setDisability', isDisabled);

        if (isDisabled) {
            this.disable();
        } else {
            this.enable();
        }

        return this;
    }

    public show(): AppMainButton {
        this.tgMainBtn.show();
        this.setVisibilityHandler && this.setVisibilityHandler(true);

        return this;
    }

    public hide(): AppMainButton {
        this.tgMainBtn.hide();
        this.setVisibilityHandler && this.setVisibilityHandler(false);

        return this;
    }

    public disable(): AppMainButton {
        this.tgMainBtn.disable;
        this.setDisabilityHandler && this.setDisabilityHandler(true);

        return this;
    }

    public enable(): AppMainButton {
        this.tgMainBtn.enable();
        this.setDisabilityHandler && this.setDisabilityHandler(false);

        return this;
    }

    public setParams(params: MainBtnParams): AppMainButton {
        this.tgMainBtn.setParams(params);

        params.is_visible !== undefined && this.setVisibility(params.is_visible);
        params.text && this.setText(params.text);
        params.text_color && this.setTextColorHandler && this.setTextColorHandler(params.text_color);
        params.color && this.setColorHandler && this.setColorHandler(params.color);

        return this;
    }

    public setReactHandlers(
        setTextHandler: (text: string) => void,
        setVisibilityHandler: (visible: boolean) => void,
        setDisabilityHandler: (isDisabled: boolean) => void,
        setTextColorHandler: (color: string) => void,
        setColorHandler: (color: string) => void,
    ): AppMainButton {
        this.setTextHandler = setTextHandler;
        this.setVisibilityHandler = setVisibilityHandler;
        this.setDisabilityHandler = setDisabilityHandler;
        this.setTextColorHandler = setTextColorHandler;
        this.setColorHandler = setColorHandler;

        return this;
    }

    public removeReactHandlers(): AppMainButton {
        this.setTextHandler = null;
        this.setVisibilityHandler = null;
        this.setDisabilityHandler = null;
        this.setTextColorHandler = null;
        this.setColorHandler = null;

        return this;
    }

    public onClickHandler() {
        console.debug('AppMainButton::onClickHandler', !!this.clickHandlerFn, this);

        if (this.clickHandlerFn) {
            this.clickHandlerFn();
        }
    }
}

class AppBackButton {
    public clickHandlerFn: Nullable<HandlerFunction> = null;
    private tgBackBtn = WebApp.BackButton;
    private setVisibilityHandler: Nullable<(visible: boolean) => void> = null;
    private isSupported;

    constructor(isSupported: boolean) {
        this.isSupported = isSupported;

        if (this.isSupported) {
            this.tgBackBtn.onClick(() => this.onClickHandler());
        }
    }

    public on(fn: HandlerFunction): AppBackButton {
        console.debug('AppBackButton::on');

        this.clickHandlerFn = fn;

        return this;
    }

    public off(): AppBackButton {
        this.clickHandlerFn = null;

        return this;
    };

    public show(): AppBackButton {
        if (this.isSupported) {
            this.tgBackBtn.show();
        }

        this.setVisibilityHandler && this.setVisibilityHandler(true);

        return this;
    }

    public hide(): AppBackButton {
        if (this.isSupported) {
            this.tgBackBtn.hide();
        }

        this.setVisibilityHandler && this.setVisibilityHandler(false);

        return this;
    }

    public setReactHandlers(
        setVisibilityHandler: (visible: boolean) => void,
    ): AppBackButton {
        this.setVisibilityHandler = setVisibilityHandler;

        return this;
    }

    public removeReactHandlers(): AppBackButton {
        this.setVisibilityHandler = null;

        return this;
    }

    public onClickHandler() {
        console.debug('AppBackButton::onClickHandler');

        this.clickHandlerFn && this.clickHandlerFn();
    }
}

class Storage {
    private isCsSupported: boolean;

    constructor() {
        this.isCsSupported = WebApp.isVersionAtLeast('6.9');
    }

    public async getItem(key: string): Promise<Nullable<string>> {
        if (this.isCsSupported) {
            return getItem(key);
        }

        return localforage.getItem<string>(key);
    }

    public async setItem(key: string, value: string): Promise<Nullable<boolean | string>> {
        if (this.isCsSupported) {
            return setItem(key, value);
        }

        return localforage.setItem(key, value);
    }
}

class AppController {
    public mainButton: AppMainButton;
    public backButton: AppBackButton;
    private tg: WebApp;
    public storage: Storage;

    constructor() {
        this.tg = WebApp;
        this.mainButton = new AppMainButton();
        this.backButton = new AppBackButton(this.tg.isVersionAtLeast('6.1'));
        this.storage = new Storage();
    }

    public ready(): AppController {
        this.tg.ready();

        return this;
    }

    public close(): AppController {
        this.tg.close();

        return this;
    }

    public expand(): AppController {
        this.tg.expand();

        return this;
    }

    public setHeaderColor(color: `#${ string }`): AppController {
        this.tg.setHeaderColor(color);

        return this;
    }

    public setBackgroundColor(color: `#${ string }`): AppController {
        this.tg.setBackgroundColor(color);

        return this;
    }

    public enableClosingConfirmation(): AppController {
        if (!this.tg.isVersionAtLeast('6.2')) {
            return this;
        }

        this.tg.enableClosingConfirmation();

        return this;
    }

    public disableClosingConfirmation(): AppController {
        if (!this.tg.isVersionAtLeast('6.2')) {
            return this;
        }

        this.tg.disableClosingConfirmation();

        return this;
    }
}

const globalAppController: AppController = new AppController();

export default globalAppController;
