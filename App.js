import { Dimensions, ScrollView, StyleSheet } from "react-native";
import SafeAreaView from "./src/components/safe-area-view/SafeAreaView";
import Deck from "./src/Deck";
import { Button, Card, Image, Text } from "react-native-elements";

const DATA = [
  {
    id: 1,
    text: "Card #1",
    uri: "https://picsum.photos/id/1/200",
  },
  {
    id: 2,
    text: "Card #2",
    uri: "https://picsum.photos/id/2/200",
  },
  {
    id: 3,
    text: "Card #3",
    uri: "https://picsum.photos/id/3/200",
  },
  {
    id: 4,
    text: "Card #4",
    uri: "https://picsum.photos/id/4/200",
  },
  {
    id: 5,
    text: "Card #5",
    uri: "https://picsum.photos/id/5/200",
  },
  {
    id: 6,
    text: "Card #6",
    uri: "https://picsum.photos/id/6/200",
  },
  {
    id: 7,
    text: "Card #7",
    uri: "https://picsum.photos/id/7/200",
  },
  {
    id: 8,
    text: "Card #8",
    uri: "https://picsum.photos/id/8/200",
  },
];

export default function App() {
  const renderCard = (item) => {
    return (
      <Card key={`card-id-${item?.id}`}>
        <Image
          source={{ uri: item?.uri }}
          resizeMode="cover"
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>{item?.text}</Text>
        <Button
          onPress={() => null}
          icon={{ name: "code" }}
          title={"View now"}
        />
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Deck renderCard={renderCard} data={DATA} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  cardImage: {
    height: 200,
  },
  cardTitle: {
    marginVertical: 12,
  },
});
