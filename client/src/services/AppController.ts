import localforage from 'localforage';
import { getItem, setItem } from './TgCloudStorage';
import { Telegram, WebApp, WebApp as WebAppTypes } from '../../../shared';

type Nullable<T> = T | null | undefined;
type HandlerFunction = () => void;

const telegramWindow = window as unknown as Window & { Telegram: Telegram };
const WebApp: WebAppTypes = telegramWindow.Telegram.WebApp;

class AppMainButton {
    public clickHandlerFn: Nullable<HandlerFunction> = null;
    private tgMainBtn = WebApp.MainButton;

    private setTextHandler: Nullable<(text: string) => void> = null;
    private setVisibilityHandler: Nullable<(visible: boolean) => void> = null;
    private setDisabilityHandler: Nullable<(isDisabled: boolean) => void> = null;

    public constructor() {
        this.tgMainBtn.onClick(() => this.onClickHandler());
    }

    public on(fn: HandlerFunction): AppMainButton {
        console.debug('AppMainButton::on');

        this.clickHandlerFn = fn;

        return this;
    }

    public off = (): AppMainButton => {
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

    public setParams() {

    }

    public setReactHandlers(
        setTextHandler: (text: string) => void,
        setVisibilityHandler: (visible: boolean) => void,
        setDisabilityHandler: (isDisabled: boolean) => void,
    ): AppMainButton {
        this.setTextHandler = setTextHandler;
        this.setVisibilityHandler = setVisibilityHandler;
        this.setDisabilityHandler = setDisabilityHandler;

        return this;
    }

    public removeReactHandlers(): AppMainButton {
        this.setTextHandler = null;
        this.setVisibilityHandler = null;

        return this;
    }

    public onClickHandler() {
        console.debug('AppMainButton::onClickHandler', !!this.clickHandlerFn, this);

        if (this.clickHandlerFn) {
            this.clickHandlerFn();
        }
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
    private tg: WebApp;
    public storage: Storage;

    constructor() {
        this.mainButton = new AppMainButton();
        this.storage = new Storage();
        this.tg = WebApp;
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

    public setHeaderColor(color: `#${string}`): AppController {
        this.tg.setHeaderColor(color);

        return this;
    }

    public setBackgroundColor(color: `#${string}`): AppController {
        this.tg.setBackgroundColor(color);

        return this;
    }
}

const globalAppController: AppController = new AppController();

export default globalAppController;
