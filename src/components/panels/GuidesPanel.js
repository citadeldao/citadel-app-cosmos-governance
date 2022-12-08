import React from 'react'
import { Accordion } from '@citadeldao/apps-ui-kit'
import text from '../../text.json'
import '../styles/uiKit/guides.css'

const GuidesPanel = () => {
    return (
        <div className='guides-panel'>
            <div>
                <h3 className='heading-text-h3'>Guides & Questions</h3>
                <p className='description-text'>Learn more about Cosmos Governance</p>
            </div>
            <Accordion type="guide" title={text.GUIDES_HEADER_1}>
                <p>{text.GUIDES_DESCRIPTION_1}</p>
            </Accordion>
            <Accordion type="guide" title={text.GUIDES_HEADER_2}>
                <div className='guide-content'>
                    <p>{text.GUIDES_DESCRIPTION_2}</p>
                </div>
            </Accordion>
            <Accordion type="guide" title={text.GUIDES_HEADER_3}>
                <div className='guide-content'>
                    <p>{text.GUIDES_DESCRIPTION_3}</p>
                    <p>{text.GUIDES_DESCRIPTION_3_1}</p>
                    <img
                        src="img/guide/1.png"
                        className='no-shadow'
                        alt='guide'
                    ></img>
                </div>
            </Accordion>
            <Accordion type="guide" title={text.GUIDES_HEADER_4}>
                <div className='guide-content'>
                    <p>{text.GUIDES_DESCRIPTION_4}</p>
                    <p>{text.GUIDES_DESCRIPTION_4_1}</p>
                    <p>{text.GUIDES_DESCRIPTION_4_2}</p>
                    <img src="img/guide/2.png"  alt='guide'></img>
                    <p>{text.GUIDES_DESCRIPTION_4_3}</p>
                    <img src="img/guide/3.png"  alt='guide'></img>
                    <p>{text.GUIDES_DESCRIPTION_4_4}</p>
                    <img src="img/guide/4.png"  alt='guide'></img>
                    <p>{text.GUIDES_DESCRIPTION_4_5}</p>
                    <p>{text.GUIDES_DESCRIPTION_4_6}</p>
                    <p>{text.GUIDES_DESCRIPTION_4_7}</p>
                </div>
            </Accordion>
            <Accordion type="guide" title={text.GUIDES_HEADER_5}>
                <div className='guide-content'>
                    <p dangerouslySetInnerHTML={{ __html: text.GUIDES_DESCRIPTION_5 }}></p>
                </div>
            </Accordion>
            <Accordion type="guide" title={text.GUIDES_HEADER_6}>
                <div className='guide-content'>
                    <p>{text.GUIDES_DESCRIPTION_6}</p>
                    <img src="img/guide/5.png"  alt='guide'></img>
                </div>
            </Accordion>
            <Accordion type="guide" title={text.GUIDES_HEADER_7}>
                <div className='guide-content'>
                    <p>{text.GUIDES_DESCRIPTION_7}</p>
                    <img className='guide-img--6'  alt='guide' src="img/guide/6.png"></img>
                </div>
            </Accordion>
        </div>
    )
}

export default GuidesPanel