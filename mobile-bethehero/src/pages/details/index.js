import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, Linking } from 'react-native';

import logoImg from '../../../src/assets/logo.png'
import styles from './styles';

import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import * as MailComposer from 'expo-mail-composer'

function Details() {

    const navigation = useNavigation();
    const message = "Olá APAE, estou entrando em contato pois gostaria de ajudar no caso da cadelinha atropelada.";

    const route = useRoute();

    const incident = route.params.incident;
    
    function navigationToBack(){
        navigation.goBack();
    }

    function sendEmail(){
        MailComposer.composeAsync({
            subject: 'Herói do caso: Cadelinha atropelada.',
            recipients: ['gil-real@hotmail.com'],
            body: message,
        });
    }

    function sendWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=${incident.whatsapp}&text=${message}`);
    }

    return (
        <View style={ styles.container }>
            <View style={ styles.header }>
                <Image source={ logoImg } />  

                <TouchableOpacity onPress={ navigationToBack  }>                            
                    <Feather name='arrow-left' size={28} color='#e02041' />
                </TouchableOpacity>
            </View>

            <View style={ styles.incident }>
                <Text style={styles.incidentProperty , { marginTop: 0 } }> Ong: </Text>
                <Text style={styles.incidentValue }> { incident.title } de { incident.city}/{incident.uf} </Text>

                <Text style={styles.incidentProperty }> Caso: </Text>
                <Text style={styles.incidentValue }> { incident.description } </Text>

                <Text style={styles.incidentProperty }> Valor: </Text>
                <Text style={styles.incidentValue }> { Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format( incident.value ) } </Text>                
            </View>


            <View style={ styles.contactBox }>                 
                <Text style={styles.heroTitle }> Salve o dia de alguém.</Text>
                <Text style={styles.heroTitle }> Seja o herói desse caso com uma doação. </Text>
                <Text style={styles.heroDescription }> Entre o contato através de: </Text>

                <View style={ styles.actions }>
                    <TouchableOpacity style={ styles.action } onPress={ sendWhatsapp }>                            
                        <Text style={styles.actionText }> WhatsApp </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={ styles.action } onPress={ sendEmail  }>                            
                        <Text style={styles.actionText }> E-mail </Text>
                    </TouchableOpacity>
                </View>                
            </View>

        </View>
    );
}

export default Details;