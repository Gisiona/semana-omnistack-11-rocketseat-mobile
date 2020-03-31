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
            console.log('Loading já em execução.');
            return;
        }

        if(total > 0 && incidents.length == total ){
            console.log('Loading já está na última pagina.');
            return;
        }

        setLoading(true);

        const response = await api.get('incidents', {
            params: { page }
        });  

        console.log(response.data);
        // forma de setar mais atualizar um estado do objeto e não atualizar o mesmo
        setIncidents([... incidents, ... response.data]);
    
        setPage(page + 1);
        console.log('Pagina: ' + page);
        
        setTotal(response.headers['x-total-count']);
        console.log("Total de Registro: " + response.headers['x-total-count']);

        setLoading(false);        
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
                data={incidents}
                style={ styles.incidentList }
                keyExtractor={ incident => String(incident.id) }
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2 } // 20%
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