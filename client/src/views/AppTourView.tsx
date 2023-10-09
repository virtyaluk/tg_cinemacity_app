/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Slide, SlideshowRef } from 'react-slideshow-image';
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import TextTransition, { presets } from 'react-text-transition';
import appController from '../services/AppController';
import { APP_NAME, APP_TOUR_FINISHED_KEY } from '../consts';
import 'react-slideshow-image/dist/styles.css';
import './AppTourView.scss';

const tourImages: string[] = ['phone_rotated', 'experience_rotated_reverse', 'movies_rotated'];
const indicators = () => (<div className="indicator">
    <div className="dot"></div>
</div>);

export default function AppTourView(): JSX.Element {
    const { t } = useTranslation();
    const [curTourSlide, setCurTourSlide] = useState<number>(0);
    const slideRef = useRef<SlideshowRef>(null);
    const navigate = useNavigate();
    const navigationThroughAppTourHandler = () => {
        switch (curTourSlide) {
            case 0:
                appController.mainButton?.setText(t('app_tour.main_btn_title_next'));
                break;
            case 1:
                appController.mainButton?.setText(t('app_tour.main_btn_title_finish'));
                break;
            case 2:
                appController.storage.setItem(APP_TOUR_FINISHED_KEY, 'true').then();
                navigate('/movies');
                break;
        }

        setCurTourSlide(curTourSlide + 1);
        slideRef?.current?.goNext();
    };

    useEffect(() => {
        appController.mainButton
            ?.show()
            .setText(t('app_tour.main_btn_title_start'));

        return () => {
            appController.mainButton?.hide();
        };
    }, []);

    useEffect(() => {
        appController.mainButton?.on(navigationThroughAppTourHandler);

        return () => {
            appController.mainButton?.off();
        };
    }, [curTourSlide]);

    return (
        <section>
            <HelmetProvider>
                <Helmet>
                    <title>{ `${ t('app_tour.page_title') } | ${ APP_NAME }` }</title>
                </Helmet>
            </HelmetProvider>

            <Container className="gx-0">
                <Slide autoplay={ false } arrows={ false } canSwipe={ false } indicators={ indicators }
                       infinite={ false } transitionDuration={ 500 } ref={ slideRef }>
                    {
                        tourImages.map((imgName: string, idx: number) =>
                            <div key={ idx } className="each-slide-effect">
                                <div style={ { 'backgroundImage': `url('assets/${ imgName }.png')` } }>
                                </div>
                            </div>)
                    }
                </Slide>
            </Container>

            <Container className="gx-5 my-3">
                <Row className="gx-5">
                    <Col xs={ 12 } className="px-5 text-center">
                        <TextTransition className="fs-1 fw-bold" springConfig={ presets.gentle }>
                            { t(`app_tour.tour_text_lines.${ curTourSlide }.headline`) }
                        </TextTransition>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" className="px-5 text-center">
                        <TextTransition className="text-muted" springConfig={ presets.gentle }>
                            { t(`app_tour.tour_text_lines.${ curTourSlide }.description`) }
                        </TextTransition>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
