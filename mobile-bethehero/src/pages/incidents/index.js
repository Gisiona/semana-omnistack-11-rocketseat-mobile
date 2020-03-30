import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import logoImg from '../../../src/assets/logo.png'
import styles from './styles';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';


function Incidents() {

    const navigation = useNavigation();
    const [ incidents, setIncidents ] = useState([]);
    const [ total, setTotal ] = useState(0);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    async function loadIncidents() {
        
        if(loading){
            return;
        }

        if(total > 0 && incidents.length == total ){
            return;
        }

        setLoading(true);

        const response = await (await api.get('incidents', {
            params: { page }
        })).data;  

        console.log(response);

        // forma de setar mais atualizar um estado do objeto e não atualizar o mesmo
        //setIncidents(... incidents.data[0], ... response.data[1]);
        const dadosApi = response.data[0];

        setIncidents(dadosApi);


        // setPage(incidents.length + 1);

        console.log(response.data[0]);

        setTotal(incidents.length);
        setPage(total + 1);
        setLoading(false);

        console.log(response.data);
    }

    useEffect(() => {
      loadIncidents();
    } , []);

    function navigationToDatail(incident){
        navigation.navigate('Details', { incident })
    }

    return (
       <View style={ styles.container }>
           <View style={ styles.header }>
               <Image source={ logoImg } />  
               <Text style={styles.headerText }> 
                    Total de <Text style={styles.headerTextBold } > { total } casos. </Text>
               </Text>
            </View>

            <Text style={styles.title }> Bem vindo! </Text>
            <Text style={styles.description }>  Escolha um dos casos abaixo e salve o dia </Text>

            <FlatList 
                data={ [ incidents ]}
                style={ styles.incidentList }
                keyExtractor={ incident => String(incident.id) }
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.1}
                renderItem={ ({ item: incident }) => (
                    <View style={ styles.incident }>
                        <Text style={styles.incidentProperty }> Ong: </Text>
                        <Text style={styles.incidentValue }> { incident.title } </Text>

                        <Text style={styles.incidentProperty }> Caso: </Text>
                        <Text style={styles.incidentValue }> { incident.description } </Text>

                        <Text style={styles.incidentProperty }> Valor: </Text>
                        <Text style={styles.incidentValue }> { Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format( incident.value ) } </Text>

                        <TouchableOpacity style={ styles.detailButton } onPress={ () => navigationToDatail(incident) } >
                            <Text style={styles.detailsButtonText }> Ver mais detalhes </Text>
                            <Feather name='arrow-right' size={ 16 } color='#e02041' />
                        </TouchableOpacity>
                    </View>    
                )}
            />

       </View>
    );
}

export default Incidents;