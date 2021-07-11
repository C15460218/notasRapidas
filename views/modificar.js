import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Alert, Button, SafeAreaView, Text, TextInput, View } from 'react-native'
import SQLite from 'react-native-sqlite-storage'
import style from '../assets/style';
import { TouchableOpacity } from 'react-native';

const db = SQLite.openDatabase({name:'mydata'})

const ModificarScreen = function({ route, navigation})
{
    const id_nota = route.params.id_nota;
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [color,setColor] = useState('')
    const [color1, setColor1] = useState('7C83FD')
    const [color2, setColor2] = useState('96BAFF')
    const [color3, setColor3] = useState('7DEDFF')
    const [color4, setColor4] = useState('88FFF7')
    const [col1, setCol1] = useState(false)
    const [col2, setCol2] = useState(false)
    const [col3, setCol3] = useState(false)
    const [col4, setCol4] = useState(false)


    function setNota(_titulo, _descripcion,_color) {
        setTitulo(_titulo)
        setDescripcion(_descripcion)
        setColor(_color)
    }

    useEffect(function() {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM notas WHERE id_nota = ?',
                [id_nota],
                function(tx, result) {
                    if (result.rows.length == 0) {
                        Alert.alert("No existe la nota para modificar");
                        navigation.goBack();
                        return;
                    }

                    let registro = result.rows.item(0)
                    setNota(registro.titulo, registro.descripcion, registro.color)
                }
            )
        })
    }, [])

    const cambioColor1 = function  (){
        Alert.alert('El color cambio a: Azul')
        setCol1(true);
    }
    const cambioColor2 = function  (){
        Alert.alert('El color cambio a: Azul claro')
        setCol2(true);
    }

    const cambioColor3 = function  (){
        Alert.alert('El color cambio a: Azul Verdoso')
        setCol3(true);
    }

    const cambioColor4 = function  (){
        Alert.alert('El color cambio a: Aqua')
        setCol4(true);
    }

    useEffect(() => {
        if(col1){
            setColor(color1);
            console.log(color);
            setCol1(false);
        }
        if(col2){
            setColor(color2);
            console.log(color);
            setCol2(false);
        }
        if(col3){
            setColor(color3);
            console.log(color);
            setCol3(false);
        }
        if(col4){
            setColor(color4);
            console.log(color);
            setCol4(false);
        }
      }, [cambioColor1,cambioColor2,cambioColor3,cambioColor4]);

    function onGuardarPress() {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE notas SET titulo = ?, descripcion = ?, color = ? WHERE id_nota = ?',
                [titulo, descripcion, color, id_nota],
                (tx, result) => {
                    if (result.rowsAffected.length === 0) {
                        Alert.alert('No se actualizaron los datos. Intente de nuevo')
                        return;
                    }
                    
                    Alert.alert('Datos actualizados correctamente')
                    navigation.goBack()
                },
                error => console.log(error)
            )
        })
    }

    return (
        <SafeAreaView>
            <TextInput placeholder="Ingrese Titulo" style={style.textInput} value={titulo} onChangeText={t => setTitulo(t)} />
            <View style={[style.form,{backgroundColor:`#${color}`}]}>
                <TextInput placeholder="Ingrese Descripción" style={style.textInput} value={descripcion} onChangeText={t => setDescripcion(t)} />
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{
                        borderWidth:1.5,
                        backgroundColor:'#7C83FD',
                        width:50,
                        height:50,
                        margin:15,
                        borderRadius:5
                    }}
                        onPress={cambioColor1}
                    ></TouchableOpacity>
                    <TouchableOpacity style={{
                        borderWidth:1.5,
                        backgroundColor:'#96BAFF',
                        width:50,
                        height:50,
                        margin:15,
                        borderRadius:5
                    }}
                        onPress={cambioColor2}
                    ></TouchableOpacity>
                    <TouchableOpacity style={{
                        borderWidth:1.5,
                        backgroundColor:'#7DEDFF',
                        width:50,
                        height:50,
                        margin:15,
                        borderRadius:5
                    }}
                        onPress={cambioColor3}
                    ></TouchableOpacity>
                    <TouchableOpacity 
                        style={{
                            borderWidth:1.5,
                            backgroundColor:'#88FFF7',
                            width:50,
                            height:50,
                            margin:15,
                            borderRadius:5
                        }}
                        onPress={cambioColor4}
                    ></TouchableOpacity>
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
                            backgroundColor:'#185ADB',
                            
                        }}
                        onPress={onGuardarPress}
                    ><Text style={{fontSize:15, color:'#FFF'}}>MODIFICAR</Text></TouchableOpacity>
                </View>
                {/* <Button title="Agregar" onPress={btnAgregarOnPress} /> */}
            </View>
        </SafeAreaView>
    )
}

export default ModificarScreen;