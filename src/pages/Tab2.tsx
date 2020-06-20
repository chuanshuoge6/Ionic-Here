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
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal'

const Tab2: React.FC = () => {

  const payPal_pay = () => {
    PayPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'Aa0fwwAFGqliwRTrBgHaEPZ2Ry3lqcynylfgNU0KuHO4W6vDJ-_hiF44-k4_6FTlT9iLBkuDqJ8Gse4P'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      PayPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('3.33', 'USD', 'Description', 'sale');
        PayPal.renderSinglePaymentUI(payment).then(res => {
          alert(JSON.stringify(res))
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, (e1) => {
          alert(e1)
          // Error or render dialog closed without being successful
        });
      }, (e2) => {
        alert(e2)
        // Error in configuration
      });
    }, (e3) => {
      alert(e3)
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PayPal Examples</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem >
            <IonButton onClick={() => payPal_pay()}>PayPal Pay</IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage >
  )
}

export default Tab2;
