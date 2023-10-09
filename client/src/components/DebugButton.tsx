/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import appController from '../services/AppController';

const debugWindow = window as unknown as Window & { showDebug: () => void; hideDebug: () => void; };

export default function DebugButton(): JSX.Element {
    const { t } = useTranslation();
    const [mainBtnTitle, setMainBtnTitle] = useState<string>('debug.main_btn_title');
    const [isMainBtnVisible, setIsMainBtnVisible] = useState<boolean>(false);
    const [isMainBtnDisabled, setIsMainBtnDisabled] = useState<boolean>(false);
    const [isBackBtnVisible, setIsBackBtnVisible] = useState<boolean>(false);
    const [showDebugSection, setShowDebugSection] = useState<boolean>(false);
    const mainBtnClickHandler = () => {
        appController.mainButton?.onClickHandler();
    };

    useEffect(() => {
        appController.mainButton?.setReactHandlers(
            (text: string) => setMainBtnTitle(text),
            (isVisible: boolean) => setIsMainBtnVisible(isVisible),
            (isDisabled: boolean) => setIsMainBtnDisabled(isDisabled),
        );

        return () => {
            appController.mainButton?.removeReactHandlers();
        };
    }, []);

    debugWindow.showDebug = () => setShowDebugSection(true);
    debugWindow.hideDebug = () => setShowDebugSection(false);

    return (
        <>
            {
                showDebugSection && <div className="container bg-gradient">
                    <div className="row">
                        <div className={ 'col-3 pb-3' + (!isBackBtnVisible && ' d-none' || '') }>
                            <div className="d-grid gap-2">
                                <button type="button" className="btn btn-primary btn-lg">
                                    <FontAwesomeIcon icon={ faArrowLeft } size="xs" />
                                </button>
                            </div>
                        </div>
                        <div className={ 'col-9 pb-3' + (!isMainBtnVisible && ' d-none' || '') }>
                            <div className="d-grid gap-2">
                                <button onClick={ mainBtnClickHandler }
                                        disabled={ isMainBtnDisabled }
                                        type="button"
                                        className={ 'btn btn-primary btn-lg' + (isMainBtnDisabled && ' disabled' || '') }>{ t(mainBtnTitle) }</button>
                            </div>
                        </div>
                    </div>
                </div> || <></>
            }
        </>
    );
};
