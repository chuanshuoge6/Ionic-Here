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
            <input id='page7' name='page' type='radio' onClick={() => window.location.href = '/tab7'}></input>
            <label for="page7" style={{ fontSize: '13px' }}> geofence</label><br />
            <input id='page8' name='page' type='radio' onClick={() => window.location.href = '/tab8'}></input>
            <label for="page8" style={{ fontSize: '13px' }}> area</label><br />
            <input id='page9' name='page' type='radio' onClick={() => window.location.href = '/tab9'}></input>
            <label for="page9" style={{ fontSize: '13px' }}> timezone</label><br />
            <input id='page10' name='page' type='radio' onClick={() => window.location.href = '/tab10'}></input>
            <label for="page10" style={{ fontSize: '13px' }}> elevation</label><br />
        </form>
    );
}