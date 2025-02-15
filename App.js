import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';

const App = () => {
  const [cep, setCep] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);

  const fetchAddress = async () => {
    if (!cep.match(/^\d{5}-?\d{3}$/)) {
      setError('CEP inválido. Formato correto: 12345-678 ou 12345678.');
      setAddress(null);
      return;
    }
    setLoading(true);
    setError(null);
    setAddress(null);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        throw new Error('CEP não encontrado.');
      }
      
      setAddress(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Digite o CEP:</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric"
        value={cep} 
        onChangeText={setCep} 
        placeholder="12345-678" 
      />
      <Button title="Consultar" onPress={fetchAddress} />
      
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}
      {address && (
        <View style={styles.result}>
          <Text>Logradouro: {address.logradouro}</Text>
          <Text>Bairro: {address.bairro}</Text>
          <Text>Cidade: {address.localidade}</Text>
          <Text>Estado: {address.uf}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  loader: {
    marginVertical: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  result: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
  },
});

export default App;
