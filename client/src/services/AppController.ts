/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import localforage from 'localforage';
import { getItem, setItem } from './TgCloudStorage';
import { Telegram, WebApp, WebApp as WebAppTypes } from '../../../shared';

type Nullable<T> = T | null | undefined;
type InvoiceStatus = 'paid' | 'cancelled' | 'failed' | 'pending';

interface TgApp {
    mainBtnClickHandler?: Nullable<() => void>;
    backBtnClickHandler?: Nullable<() => void>;
}

const DEFAULT_USED_ID: number = 57829451;

const telegramWindow = window as unknown as Window & { Telegram: Telegram };
const tgAppWindow = window as unknown as Window & { TgApp: TgApp };
const WebApp: WebAppTypes = telegramWindow.Telegram.WebApp;

interface MainBtnParams {
    color?: string;
    text?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
}

class AppMainButton {
    private tgMainBtn = WebApp.MainButton;
    private onClickFn: Nullable<VoidFunction>;

    public constructor() {
        tgAppWindow.TgApp.mainBtnClickHandler = () => {
            this.onClickFn && this.onClickFn();
        };
    }

    public on(handler: VoidFunction): AppMainButton {
        console.debug('AppMainButton::on');

        this.tgMainBtn.onClick(handler);
        this.onClickFn = handler;

        return this;
    }

    public off(handler: VoidFunction): AppMainButton {
        this.tgMainBtn.offClick(handler);
        this.onClickFn = null;

        return this;
    };

    public setText(text: string): AppMainButton {
        console.debug('AppMainButton::setText', text);

        this.tgMainBtn.setText(text);

        return this;
    }

    public setVisibility(isVisible: boolean): AppMainButton {
        console.debug('AppMainButton::setVisibility', isVisible);

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

        return this;
    }

    public hide(): AppMainButton {
        this.tgMainBtn.hide();

        return this;
    }

    public disable(): AppMainButton {
        this.tgMainBtn.disable;

        return this;
    }

    public enable(): AppMainButton {
        this.tgMainBtn.enable();

        return this;
    }

    public setParams(params: MainBtnParams): AppMainButton {
        this.tgMainBtn.setParams(params);

        return this;
    }

    public showProgress(): AppMainButton {
        this.tgMainBtn.showProgress();

        return this;
    }

    public hideProgress(): AppMainButton {
        this.tgMainBtn.hideProgress();

        return this;
    }

    public reset(isVisible: boolean): AppMainButton {
        return this
            .enable()
            .hideProgress()
            .setVisibility(isVisible);
    }
}

class AppBackButton {
    private tgBackBtn = WebApp.BackButton;
    private onClickFn: Nullable<VoidFunction>;
    private readonly isSupported: boolean;

    constructor(isSupported: boolean) {
        this.isSupported = isSupported;
        tgAppWindow.TgApp.backBtnClickHandler = () => {
            this.onClickFn && this.onClickFn();
        };
    }

    public on(handler: VoidFunction): AppBackButton {
        console.debug('AppBackButton::on');

        if (this.isSupported) {
            this.tgBackBtn.onClick(handler);
        }

        this.onClickFn = handler;

        return this;
    }

    public off(handler: VoidFunction): AppBackButton {
        if (this.isSupported) {
            this.tgBackBtn.offClick(handler);
        }

        this.onClickFn = null;

        return this;
    };

    public show(): AppBackButton {
        if (this.isSupported) {
            this.tgBackBtn.show();
        }

        return this;
    }

    public hide(): AppBackButton {
        if (this.isSupported) {
            this.tgBackBtn.hide();
        }

        return this;
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
        tgAppWindow.TgApp = {};
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

    public getUserId(): number {
        return this.tg.initDataUnsafe?.user?.id ?? DEFAULT_USED_ID;
    }

    public openInvoice(url: string): Promise<InvoiceStatus> {
        console.debug('AppController::openInvoice', url);

        return new Promise((resolve) => {
            this.tg.openInvoice(url, (status: InvoiceStatus) => {
                resolve(status);
            });
        });
    }
}

const globalAppController: AppController = new AppController();

export default globalAppController;
