import React, { useState } from 'react'
import { useEffect } from 'react';
import { Button, FlatList, SafeAreaView, TouchableHighlight,TouchableOpacity, Text,ScrollView,View } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
import style from '../assets/style'

//import CustomButton from '../controls/custombutton'

const db = SQLite.openDatabase({name:'mydata'});


const InicioScreen = function({ navigation }) {

    const [notas, setNotas] = useState([]);

    useEffect(function() {
        db.transaction(function(t) {
            // t.executeSql('DROP TABLE IF EXISTS contactos',[],
            //     () => console.log('DROPED TABLE contactos'),
            //     error => console.log({error})
            // );
            t.executeSql(
                'CREATE TABLE IF NOT EXISTS notas (' +
                'id_nota    INTEGER         PRIMARY KEY     AUTOINCREMENT,' +
                'titulo         VARCHAR(20)    NOT NULL,' +
                'descripcion       VARCHAR(200)     NOT NULL,' +
                'color         VARCHAR(6)     NOT NULL' + 
                ');',
                [],
                () => console.log('CREATED TABLE notas'),
                error => console.log({error})
            );
        })
    }, []);

    useEffect(function() {
        navigation.addListener('focus', function() {
            db.transaction(function(t) {
                t.executeSql("SELECT * FROM notas",[], function(tx, res) {
                    let data = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        data.push(res.rows.item(i));
                    }
                    setNotas(data);
                }, (error) => { console.log({ error }) });
            });
        })
    }, [navigation]);

    const notaItem = function({ item }) {
        const onPress = function() {
            // console.log({item});
            navigation.navigate('itemScreen', {id_nota:item.id_nota})
        }
        return (
            <TouchableOpacity onPress={onPress} style={[style.itemContacto,{backgroundColor:`#${item.color}`}]}>
                <Text style={style.itemContactoTitle}>{item.titulo}</Text>
                <Text style={style.itemNotaDetails}>{item.descripcion}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView>
            <View>
                <FlatList
                    data={notas}
                    renderItem={notaItem}
                    keyExtractor={i=>i.id_nota}
                />
            </View>
            <View 
                    style={{
                        alignItems:'center'
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width:200,
                            margin:20,
                            alignItems:'center',
                            height: 40,
                            justifyContent:'center',
                            borderRadius:30,
                            backgroundColor:'#2F5D62',
                            
                        }}
                        onPress={()=>navigation.navigate('agregarScreen')}
                    ><Text style={{fontSize:15, color:'#FFF'}}>AGREGAR NOTA</Text></TouchableOpacity>
                </View>
        </SafeAreaView>
    )
}

export default InicioScreen;