

const BottomSheetMini = () => {
    return (
        <div className="p-3">
            <h6 className="mb-2">Informações</h6>
            <div className="mb-2">Seu conteúdo aqui</div>
            <button
                className="btn btn-primary btn-sm w-100"
                onClick={() => alert('Botão clicado!')}
            >
                Ação
            </button>
        </div>
    )
}

const BottomSheetMedium = () => {
    const TestComponent = () => {
        return (
            <div className="p-3 border rounded mb-3 bg-light d-flex flex-row">
                <i className="bi bi-info-circle-fill me-2"></i>
                <p><b>Informações:</b> Este é um exemplo de conteúdo para o BottomSheet.</p>
            </div>
        )
    }
    return (
        <div className="overflow-scroll">
            <p className="text-primary fs-1 fw-bold">Olá Mundo!</p>

            <TestComponent />
            <TestComponent />
            <TestComponent />
            <TestComponent />
            <TestComponent />
            <TestComponent />
            <TestComponent />

        </div>
    )
}


const BottomSheetFull = () => {

}

const BottomSheetContent = ({ anchor }) => {
    const contentMap = {
        0: BottomSheetMini,
        1: BottomSheetMedium,
        2: BottomSheetFull
    }
    const Content = contentMap[anchor] || BottomSheetMini;

    return (
        <Content anchor={anchor} />
    )
}

export default BottomSheetContent;




