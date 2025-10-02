import React, { useRef } from "react";
import InvitePopupComponent from "./InvitePopupComponent";
import InvitePopup from "./InvitePopup";
import ActionButton from "@web/components/common/buttons/ActionButton";

/**
 * Componente modal dedicado para gerenciamento de convites
 * Utiliza o PopUpComponent existente com largura aumentada
 */
const InvitePopupModal = () => {
    const popupRef = useRef();

    const showInvitePopup = () => {
        if (popupRef.current) {
            popupRef.current.show({
                content: ({ close }) => <InvitePopup close={close} />,
                props: {},
                title: ""
            });
        }
    };

    return (
        <>
            {/* Botão para abrir o popup */}
            <ActionButton
                text="Gerenciar Convites"
                icon="bi bi-plus-fill"
                onClick={showInvitePopup}
                variant="primary"
                size="lg"
            />

            {/* Popup component com largura customizada */}
            <InvitePopupComponent ref={popupRef} />
        </>
    );
};

export default InvitePopupModal;
