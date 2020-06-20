import React, { useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonAlert, IonButton, IonCard, IonCardHeader,
  IonCardSubtitle, IonCardTitle, IonCardContent,
  IonItem, IonIcon, IonLabel, IonBadge, IonList,
  IonItemDivider, IonCheckbox, IonChip, IonAvatar,
  IonGrid, IonRow, IonCol, IonInput, IonToggle,
  IonModal, IonRefresher, IonRefresherContent,
  IonTextarea, IonSelect, IonListHeader,
  IonSelectOption, IonButtons, IonBackButton,
  IonMenuButton, IonSegment, IonSearchbar,
  IonSegmentButton, IonFooter, IonText, IonToast,
  useIonViewDidEnter, useIonViewDidLeave,
  useIonViewWillEnter, useIonViewWillLeave
} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import {
  person
} from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
import Here from '../components/Here'

const Tab1: React.FC = () => {

  return (
    <IonPage>
      <Here />
    </IonPage>
  );
};

export default Tab1;
