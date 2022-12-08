import React, { useRef } from 'react';
// eslint-disable-next-line
import { Header, Content } from '@citadeldao/apps-ui-kit/dist/main';
import GuidesPanel from './GuidesPanel';

const InfoPanel = (props) => {
    const headerRef = useRef();

    return (
        <section className="info-panel">
            <div className="panel-header-line" style={{ background: props.config.headerParamsFromConfig('TOP_BACKGROUND_COLOR') }}></div>
            <Header refs={headerRef}/>
            <Content>
                <GuidesPanel/>
            </Content>
        </section>
    );
};

export default InfoPanel;