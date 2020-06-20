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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm'

const Tab3: React.FC = () => {
  const buyer_publishable_key = 'pk_test_51GsgRBBMl0RuVIMsHRfU1TJP9jjjVI7QWfSO8zne0ZZ3BALqEvFix8HZiwUPatS33haCJD21eMBtvfsv79NnOopb004Tyq8Enp'
  const stripePromise = loadStripe(buyer_publishable_key);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Stripe Example</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </IonContent>
    </IonPage>

  );
};

export default Tab3;
