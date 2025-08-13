import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import api from "@mobile/api/api";
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import BusLineCard from "@mobile/components/BusLineCard";
import PopUpComponent from "@mobile/components/PopUpComponent";
import SearchBar from "@mobile/components/SearchBar";

function PopUpContent(){
  return (
    <>
      <Text>Olá do Pop-up!</Text>
      <Text>Este é um exemplo de conteúdo dentro do pop-up.</Text>
    </>
  );
}

function SheetPreview(){
  return (
    <>
      <Text style={{textAlign: "center",fontSize:24, marginBottom: 24}}> Ola, Nome</Text>

      <BusLineCard name="Giraldi 2246" time="5h45"/>
      <BusLineCard name="Giraldi 4355" time="14h40"/>
    </>
  )
}

function SheetFull(){
  const [searchValue, setSearchValue] = useState("")

  return (
    <>
      <SearchBar
        value={searchValue}
        onChangeText={setSearchValue}
      />
    </>
  )
}

export default function IndexScreen() {
  const param = useLocalSearchParams();
  const snapPoints = ["40%","95%"]
  const [bottomSheetIndex, setBottomSheetIndex] = useState(0) //Começa no primeiro ponto
  const bottomSheetModalRef = useRef(null);
  const popUpRef = useRef(null);

  const apiTest = async (popUpRef) => {
    const response = await api.passengers.list();
    popUpRef.current.show({ content: `API Response: ${JSON.stringify(response)}` });
  }
  const handleBottomSheetChanges = useCallback((index) => {
    // Se o indice não existir no array de snapPoints, setamos para o último
    if(index > snapPoints.length - 1){
      index = snapPoints.length - 1
    }
    setBottomSheetIndex(index);
  }, []);

  const openBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const openPopUp = () => {
    // 3. Use a referência para chamar o método 'show' do PopUpComponent
    if (popUpRef.current) {
      // Passamos o componente que queremos mostrar (MyPopUpContent)
      // e um objeto com as props que MyPopUpContent precisa (message neste exemplo)
      popUpRef.current.show(PopUpContent, { message: 'Olá do Pop-up na tela inicial!' });
    }
  };

  const renderContent = () => {
    switch (bottomSheetIndex) {
      case 0:
        return <SheetPreview />

      case 1:
        return <SheetFull />

      default:
        return null
    }
  }

  return (
      <View style={styles.container}>
        <Button
          title="Botao"
          onPress={() => apiTest(popUpRef)}
          >

        </Button>
        <Text>
          {JSON.stringify(param)}
        </Text>

        <BottomSheetModal
          enablePanDownToClose={false}
          index={0}
          snapPoints={snapPoints} 
          onChange={handleBottomSheetChanges}
          ref={bottomSheetModalRef}
          >

          <BottomSheetView style={styles.contentContainer}>
            <Text>{bottomSheetIndex}</Text>
            {renderContent()}
          </BottomSheetView>
            </BottomSheetModal>

        <PopUpComponent ref={popUpRef} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    width: "100%",
    height: "100%",
    },
    containerHeadline: {
        fontSize: 24,
        fontWeight: '600',
        padding: 20
    }

});
