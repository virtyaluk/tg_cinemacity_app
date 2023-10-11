/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import localforage from 'localforage';
import * as cloudStorage from './TgCloudStorage';
import { APP_MAIN_BTN_COLOR, APP_MAIN_BTN_DISABLED_COLOR } from '../consts';
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
        this.tgMainBtn.setText(text);

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
        this.setParams({ color: APP_MAIN_BTN_DISABLED_COLOR });
        this.tgMainBtn.disable();

        return this;
    }

    public enable(): AppMainButton {
        this.setParams({ color: APP_MAIN_BTN_COLOR });
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
    private readonly isSupported: boolean;

    constructor(isSupported: boolean) {
        this.isSupported = isSupported;
    }

    public async getItem(key: string): Promise<Nullable<string>> {
        if (this.isSupported) {
            return await cloudStorage.getItem(key);
        }

        return await localforage.getItem<string>(key);
    }

    public async setItem(key: string, value: string): Promise<Nullable<boolean | string>> {
        if (this.isSupported) {
            return await cloudStorage.setItem(key, value);
        }

        return await localforage.setItem(key, value);
    }
}

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationStyle = 'error' | 'success' | 'warning';

class HapticFeedback {
    private readonly isSupported: boolean;
    private hf = WebApp.HapticFeedback;

    constructor(isSupported: boolean) {
        this.isSupported = isSupported;
    }

    public impact(style: ImpactStyle): HapticFeedback {
        if (this.isSupported) {
            this.hf.impactOccurred(style);
        }

        return this;
    }

    public notification(style: NotificationStyle): HapticFeedback {
        if (this.isSupported) {
            this.hf.notificationOccurred(style);
        }

        return this;
    }

    public selectionChanged(): HapticFeedback {
        if (this.isSupported) {
            this.hf.selectionChanged();
        }

        return this;
    }
}

class AppController {
    public mainButton: AppMainButton;
    public backButton: AppBackButton;
    public brr: HapticFeedback;
    private tg: WebApp;
    public storage: Storage;

    constructor() {
        tgAppWindow.TgApp = {};
        this.tg = WebApp;
        this.mainButton = new AppMainButton();
        this.backButton = new AppBackButton(this.tg.isVersionAtLeast('6.1'));
        this.storage = new Storage(this.tg.isVersionAtLeast('6.9'));
        this.brr = new HapticFeedback(this.tg.isVersionAtLeast('6.1'));
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

    public closingConfirmation(enable: boolean): AppController {
        if (enable) {
            this.enableClosingConfirmation();
        } else {
            this.disableClosingConfirmation();
        }

        return this;
    }

    public getUserId(): number {
        return this.tg.initDataUnsafe?.user?.id ?? DEFAULT_USED_ID;
    }

    public openInvoice(url: string): Promise<InvoiceStatus> {
        return new Promise((resolve) => {
            this.tg.openInvoice(url, (status: InvoiceStatus) => {
                resolve(status);
            });
        });
    }
}

const globalAppController: AppController = new AppController();

export default globalAppController;
