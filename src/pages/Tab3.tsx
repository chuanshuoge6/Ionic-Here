import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonAlert, IonButton, IonCard, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonCardContent,
  IonItem, IonIcon, IonLabel, IonBadge, IonList,
  IonItemDivider, IonCheckbox, IonFab, IonFabButton,
  IonFabList, IonItemGroup, IonItemSliding,
  IonItemOptions, IonItemOption, IonNote, IonMenu,
  IonRouterOutlet, IonListHeader, IonMenuToggle,
  IonButtons, IonMenuButton, IonInput, IonSplitPane,
  IonPopover, IonSpinner, IonRadioGroup, IonRadio,
  IonRange, IonSearchbar, IonFooter, IonSegmentButton,
  IonSegment, IonToast, IonToggle, IonTextarea, IonText,
  IonSelect, IonSelectOption, IonModal, IonBackButton
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';
import {
  add, trash, ellipsisHorizontalOutline
} from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import Here3 from '../components/Here3'

const Tab3: React.FC = () => {

  return (
    <IonPage>
      <Here3 />
    </IonPage>

  );
};

export default Tab3;
