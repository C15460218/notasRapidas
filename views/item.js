import React from 'react'
import { useEffect } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import style from '../assets/style'
import { TouchableOpacity } from 'react-native';

const db = SQLite.openDatabase({name:'mydata'}, ()=>console.log('CONNECTED ITEM'))

const ItemScreen = function({ route, navigation }) {
    const id_nota = route.params.id_nota;
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [color,setColor] = useState('')

    const setStates = function(titulo,descripcion,color) {
        setTitulo(titulo)
        setDescripcion(descripcion)
        setColor(color)
    }

    function onModificarPress() {
        navigation.navigate('modificarScreen', {id_nota})
    }

    function onEliminarPress() {
        Alert.alert('¿Desea elminar?',
            '¿Está seguro que desea elminar el registro?\nEsta acción no se puede deshacer',
            [
                {
                    text: "Sí",
                    onPress: (v) => {
                        db.transaction(tx => {
                            tx.executeSql(
                                'DELETE FROM notas WHERE id_nota = ?',
                                [id_nota],
                                (tx, res) => {
                                    if (res.rowsAffected === 0) {
                                        Alert.alert('Fallo al eliminar', 'No se eliminó el registro')
                                        return;
                                    }

                                    navigation.goBack()
                                },
                                error => console.log(error)
                            )
                        })
                    }
                },
                {
                    text: 'No'
                }
            ])
    }

    useEffect(function(){
        navigation.addListener('focus', function() {
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM notas WHERE id_nota = ?",
                [id_nota],
                function(tx2, res) {
                    if (res.rows.length === 0) {
                        alert("No se encontró la nota");
                        return;
                    }
                    let row = res.rows.item(0)
                    setStates(row.titulo, row.descripcion,row.color)
                },
                error => console.log({error}))
            })
        })
    }, [navigation]);

    return (
        <SafeAreaView>
            <View style={style.dataBox}>
            <Text style={style.itemContactoTitle}>{titulo}</Text>
            <TouchableOpacity style={[style.itemContacto,{backgroundColor:`#${color}`}]}>
                <Text style={style.itemContactoDetails}>{descripcion}</Text>
            </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                            style={{
                                width:150,
                                alignItems:'center',
                                height: 40,
                                justifyContent:'center',
                                borderRadius:30,
                                backgroundColor:'#FFA900',
                                marginRight:20,
                                marginLeft:25,
                                marginTop:20
                            }}
                            onPress={onModificarPress}
                >
                    <Text style={{fontSize:15, color:'#FFF'}}>MODIFICAR NOTA</Text>
                </TouchableOpacity>
                <TouchableOpacity
                            style={{
                                width:150,
                                alignItems:'center',
                                height: 40,
                                justifyContent:'center',
                                borderRadius:30,
                                backgroundColor:'#CD113B',
                                margin:20
                            }}
                            onPress={onEliminarPress}
                >
                    <Text style={{fontSize:15, color:'#FFF'}}>ELIMINAR NOTA</Text>
                </TouchableOpacity>
                {/* <Button color="orange" title="Modificar" onPress={onModificarPress} />
                <Button color="red" title="Eliminar" onPress={onEliminarPress} /> */}
            </View>
        </SafeAreaView>
    );
}

export default ItemScreen;