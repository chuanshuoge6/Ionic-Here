import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

import CardSection from '../components/CardSection';
import { IonButton, IonItem, IonLabel, IonInput } from '@ionic/react';

export default function CheckoutForm() {
    const [purchase, setPurchase] = useState('')

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        console.log('purchase', purchase)
        const result = await stripe.confirmCardPayment(purchase, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Jenny Rosen',
                },
            }
        });

        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
                alert(result.paymentIntent.amount + ' ' + result.paymentIntent.currency + ' paid')
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <IonItem>
                <IonLabel>Purchase</IonLabel>
                <IonInput class='ion-text-right' placeholder='server encryption'
                    onIonChange={e => setPurchase(e.detail.value)}></IonInput>
            </IonItem>
            <CardSection />
            <IonButton disabled={!stripe} expand='block' type='submit'>Stripe Pay</IonButton>
        </form>
    );
}