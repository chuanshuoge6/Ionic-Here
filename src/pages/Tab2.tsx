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
import Here2 from '../components/Here2'

const Tab2: React.FC = () => {

  return (
    <IonPage>
      <Here2 />
    </IonPage>
  )
}

export default Tab2;
