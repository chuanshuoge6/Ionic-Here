import React, { useState } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonAlert, IonButton, IonCard, IonCardHeader,
    IonCardSubtitle, IonCardTitle, IonCardContent,
    IonItem, IonIcon, IonLabel, IonDatetime, IonFooter,
    IonList, IonItemDivider, IonTextarea, IonAvatar,
    IonText, IonThumbnail, IonSelectOption, IonInput,
    IonSelect, IonCheckbox, IonToggle, IonRange,
    IonNote, IonRadio, IonItemSliding, IonItemOption,
    IonItemOptions, IonListHeader, IonChip, IonImg,
    IonLoading, IonProgressBar, IonSkeletonText,
    IonReorder, IonReorderGroup, IonSlide, IonSlides,
    IonTabBar, IonTabs, IonTabButton, IonBadge,
    IonRouterOutlet
} from '@ionic/react';
import './Tab2.css';
import {
    calendar, personCircle, map,
    informationCircle
} from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import Here4 from '../components/Here4'

const Tab4: React.FC = () => {

    return (
        <IonPage>
            <Here4 />
        </IonPage>
    )
}

export default Tab4;
