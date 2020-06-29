import React, { useState, useEffect } from 'react';

export default function PageForm() {

    return (
        <form id='pageForm' style={{ display: 'none' }}>
            <input id='page1' name='page' type='radio' onClick={() => window.location.href = '/tab1'}></input>
            <label for="page1" style={{ fontSize: '13px' }}> measure</label><br></br>
            <input id='page2' name='page' type='radio' onClick={() => window.location.href = '/tab2'}></input>
            <label for="page2" style={{ fontSize: '13px' }}> domMarker</label><br></br>
            <input id='page3' name='page' type='radio' onClick={() => window.location.href = '/tab3'}></input>
            <label for="page3" style={{ fontSize: '13px' }}> cluster</label><br />
            <input id='page4' name='page' type='radio' onClick={() => window.location.href = '/tab4'}></input>
            <label for="page4" style={{ fontSize: '13px' }}> kml</label><br />
            <input id='page5' name='page' type='radio' onClick={() => window.location.href = '/tab5'}></input>
            <label for="page5" style={{ fontSize: '13px' }}> search</label><br />
            <input id='page6' name='page' type='radio' onClick={() => window.location.href = '/tab6'}></input>
            <label for="page6" style={{ fontSize: '13px' }}> route</label><br />
        </form>
    );
}