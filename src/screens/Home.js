import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { getPets, toggleFavorite } from '../services/petsApi';
import colors from "../../colors";

export default function Home() {
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categorias fixas (não precisam ser buscadas da API)
  const categories = [
    { label: "Todos", icon: "paw" },
    { label: "Cachorros", icon: "dog" },
    { label: "Gatos", icon: "cat" },
    { label: "Aves", icon: "crow" },
    { label: "Outros", icon: "kiwi-bird" }
  ];

  const [activeCategory, setActiveCategory] = useState("Todos");

  // Carrega os pets da API mockada
  const fetchPets = async () => {
    try {
      setLoading(true);
      const petsData = await getPets();
      setPets(petsData);
      setFilteredPets(petsData);
    } catch (error) {
      console.error("Error fetching pets:", error);
      Alert.alert("Erro", "Não foi possível carregar os pets. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Atualiza favorito localmente e na "API" mockada
  const handleToggleFavorite = async (id) => {
    try {
      const updatedPets = await toggleFavorite(id);
      setPets(updatedPets);
      setFilteredPets(
        activeCategory === "Todos"
          ? updatedPets
          : updatedPets.filter((p) => p.category === activeCategory)
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
    if (category === "Todos") return setFilteredPets(pets);
    const filtered = pets.filter((p) => p.category === category);
    setFilteredPets(filtered);
  };

  const handleCallButton = () => {
    Linking.openURL(`tel:${'SEU_NUMERO_DE_TELEFONE'}`);
  };

  const renderPet = ({ item }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => navigation.navigate("PetDetails", { pet: item })}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.image}
        defaultSource={require('../../assets/default-pet.png')}
      />

      <TouchableOpacity
        style={styles.heartIcon}
        onPress={(e) => {
          e.stopPropagation();
          handleToggleFavorite(item.id);
        }}
      >
        <AntDesign
          name={item.favorited ? "heart" : "hearto"}
          size={24}
          color={item.favorited ? "#ff4444" : "#fff"}
        />
      </TouchableOpacity>

      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petBreed}>{item.breed || "Raça não especificada"}</Text>
        <View style={styles.petDetails}>
          <Ionicons name="location-outline" size={14} color={colors.gray} />
          <Text style={styles.details}> {item.location || "Local não informado"}</Text>
          <Ionicons name="paw-outline" size={14} color={colors.gray} style={styles.detailIcon} />
          <Text style={styles.details}> {item.age || "Idade não informada"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Olá, bem-vindo!</Text>
          <Text style={styles.title}>Encontre seu novo amigo 🐾</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Botão de Agendamento */}
      <TouchableOpacity 
        style={styles.scheduleButton}
        onPress={handleCallButton}
      >
        <FontAwesome5 name="calendar-alt" size={16} color="#fff" />
        <Text style={styles.scheduleButtonText}>Agendar Consulta</Text>
      </TouchableOpacity>

      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.label}
            style={[
              styles.categoryButton,
              activeCategory === cat.label && styles.activeCategory,
            ]}
            onPress={() => filterByCategory(cat.label)}
          >
            <FontAwesome5
              name={cat.icon}
              size={16}
              color={activeCategory === cat.label ? "#fff" : colors.gray}
            />
            <Text
              style={[
                styles.categoryText,
                activeCategory === cat.label && styles.activeCategoryText,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de Pets */}
      {filteredPets.length > 0 ? (
        <FlatList
          data={filteredPets}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderPet}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchPets}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="paw-outline" size={48} color={colors.gray} />
          <Text style={styles.emptyText}>Nenhum pet encontrado</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchPets}
          >
            <Text style={styles.refreshButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botões Flutuantes */}
      <TouchableOpacity
        style={[styles.floatingButton, styles.favoritesButton]}
        onPress={() => navigation.navigate("Favoritos")}
      >
        <Entypo name="heart" size={24} color="#fff" />
      </TouchableOpacity>
      

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.gray,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.dark,
    marginTop: 4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    marginLeft: -30,
    marginBottom: 40,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryContainer: {
    paddingBottom: 10,
  },
  categoryButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: 8,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#fff",
  },
  list: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  petCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "48%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
    padding: 6,
    zIndex: 1,
  },
  petInfo: {
    padding: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 8,
  },
  petDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  details: {
    fontSize: 12,
    color: colors.gray,
  },
  detailIcon: {
    marginLeft: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  chatButton: {
    backgroundColor: colors.primary,
    right: 30,
  },
  favoritesButton: {
    backgroundColor: "#ff4444",
    right: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    marginTop: 16,
  },
  refreshButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});