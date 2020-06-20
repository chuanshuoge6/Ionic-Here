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
    useIonViewWillEnter, useIonViewWillLeave,
} from '@ionic/react';
import {
    person
} from 'ionicons/icons';
import { RefresherEventDetail } from '@ionic/core';
import axios from 'axios'
import { RouteComponentProps } from "react-router-dom";

interface Props extends RouteComponentProps<{
    id: string;
}> { }

const Detail: React.FC<Props> = ({ match }) => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Detail Page</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem>Detail # {match.params.id}</IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Detail;
