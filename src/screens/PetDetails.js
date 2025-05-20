import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';

export default function PetDetails({ route, navigation }) {
  const { pet } = route.params;

  const owner = {
    name: pet.ownerName || 'Nome não disponível',
    email: pet.ownerEmail || 'Email não disponível',
    phone: pet.ownerPhone || 'Telefone não disponível',
    uid: pet.uid // necessário para iniciar o chat
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: pet.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.info}>🐾 Idade: {pet.age}</Text>
        <Text style={styles.info}>📍 Local: {pet.location}</Text>

        <View style={styles.ownerBox}>
          <Text style={styles.sectionTitle}>Sobre o dono</Text>
          <Text style={styles.owner}>👤 Nome: {owner.name}</Text>
          <Text style={styles.owner}>✉️ Email: {owner.email}</Text>
          <Text style={styles.owner}>📞 Telefone: {owner.phone}</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.adoptButton}>
            <Ionicons name="paw" size={20} color="#fff" />
            <Text style={styles.buttonText}>Quero Adotar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat', { receiverId: owner.uid })}
          >
            <Entypo name="chat" size={20} color="#fff" />
            <Text style={styles.buttonText}>Conversar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: {
    width: '100%',
    height: 280,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#333',
  },
  ownerBox: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  owner: {
    fontSize: 15,
    color: '#444',
    marginTop: 2,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  adoptButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f97316',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});