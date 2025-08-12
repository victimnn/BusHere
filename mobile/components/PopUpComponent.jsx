import React, { useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Usamos forwardRef para permitir que o componente pai obtenha uma referência a ele
const PopUpComponent = forwardRef((props, ref) => {
  // Estado do modal contendo:
  // - isVisible: controla se o modal está visível
  // - ContentComponent: componente a ser renderizado dentro do modal
  // - componentProps: props a serem passadas para o ContentComponent
  // - title: título do modal
  const [modalState, setModalState] = useState({
    isVisible: false,
    ContentComponent: null,
    componentProps: {},
    title: '',
  });

  // Função para ocultar o modal
  const hide = useCallback(() => {
    setModalState({
      isVisible: false,
      ContentComponent: null,
      componentProps: {},
      title: '',
    });
  }, []);

  /**
   * Função para exibir o modal
   * @param {Object} params - Parâmetros do modal
   * @param {Function} params.content - Função que retorna o conteúdo do modal
   * @param {Object} params.props - Props a serem passadas para o conteúdo
   * @param {string} params.title - Título do modal
   */
  const show = useCallback(({ content, props = {}, title = '' }) => {
    // Se content for função, cria componente que chama a função (mantém compatibilidade)
    // Se for string ou JSX, apenas renderiza direto
    let ContentComponent;
    if (typeof content === 'function') {
      ContentComponent = () => content({ close: hide, ...props });
    } else if (typeof content === 'string') {
      ContentComponent = () => <Text>{content}</Text>;
    } else {
      // JSX direto
      ContentComponent = () => content;
    }
    setModalState({
      isVisible: true,
      ContentComponent,
      componentProps: {},
      title,
    });
  }, [hide]);

  // Expõe as funções show e hide para componentes pais através da ref
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }), [show, hide]);

  // Desestrutura o estado do modal
  const { isVisible, ContentComponent, componentProps, title } = modalState;
  // O que o componente renderiza (o Modal)
  // O Modal é um componente que cobre toda a tela e exibe o conteúdo dentro dele
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={hide}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={hide}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.popUpContainer}>
              {/* Cabeçalho do modal */}
              <View style={styles.header}>
                {/* Título opcional */}
                {title ? <Text style={styles.title}>{title}</Text> : null}
                {/* Botão de fechar */}
                <TouchableOpacity onPress={hide} style={styles.closeButton}>
                  <Icon name="close" size={32} color="#000" />
                </TouchableOpacity>
              </View>
              {/* Corpo do modal onde o conteúdo é renderizado */}
              <View style={styles.body}>
                {ContentComponent && <ContentComponent {...componentProps} />}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

// Estilos para o componente
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popUpContainer: {
    backgroundColor: '#fff',
    padding: 0,
    borderRadius: 10,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#222',
  },
  closeButton: {
    marginLeft: 12,
  },
  body: {
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default PopUpComponent;