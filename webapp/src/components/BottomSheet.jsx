import React, { useState, useEffect} from 'react';


const BottomSheet = ({ isOpen, onClose, children, minHeight = 80, maxHeight = 80 }) => {
    // maxHeight is now a percentage of viewport height (default 80%)
    const sheetRef = React.useRef(null);
    const [height, setHeight] = useState(minHeight);
    const [dragging, setDragging] = useState(false);
    const startY = React.useRef(0);
    const startHeight = React.useRef(minHeight);

    // Helper to get max height in px
    const getMaxHeightPx = () => {
        return Math.round(window.innerHeight * (maxHeight / 100));
    };

    // Mouse/touch drag handlers
    const onDragStart = (e) => {
        setDragging(true);
        startY.current = e.touches ? e.touches[0].clientY : e.clientY;
        startHeight.current = height;
        document.body.style.userSelect = "none";
    };
    const onDragMove = (e) => {
        if (!dragging) return;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let newHeight = startHeight.current + (startY.current - clientY);
        const maxPx = getMaxHeightPx();
        newHeight = Math.max(minHeight, Math.min(maxPx, newHeight));
        setHeight(newHeight);
    };
    const onDragEnd = () => {
        setDragging(false);
        document.body.style.userSelect = "";
    };

    useEffect(() => {
        if (dragging) {
            window.addEventListener("mousemove", onDragMove);
            window.addEventListener("touchmove", onDragMove);
            window.addEventListener("mouseup", onDragEnd);
            window.addEventListener("touchend", onDragEnd);
        } else {
            window.removeEventListener("mousemove", onDragMove);
            window.removeEventListener("touchmove", onDragMove);
            window.removeEventListener("mouseup", onDragEnd);
            window.removeEventListener("touchend", onDragEnd);
        }
        return () => {
            window.removeEventListener("mousemove", onDragMove);
            window.removeEventListener("touchmove", onDragMove);
            window.removeEventListener("mouseup", onDragEnd);
            window.removeEventListener("touchend", onDragEnd);
        };
    }, [dragging]);

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1050,
                pointerEvents: 'none',
            }}
        >
            <div
                ref={sheetRef}
                className="bg-light shadow rounded-top p-3 border"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height,
                    maxHeight: `calc(${maxHeight}vh)`,
                    pointerEvents: 'auto',
                    overflow: 'hidden',
                    transition: dragging ? 'none' : 'height 0.2s',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: 32,
                        cursor: 'grab',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onMouseDown={onDragStart}
                    onTouchStart={onDragStart}
                >
                    <div
                        style={{
                            width: 40,
                            height: 6,
                            background: '#ccc',
                            borderRadius: 3,
                            margin: '8px 0',
                        }}
                    />
                </div>
                <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                    {children}
                </div>
                <button
                    type="button"
                    className="btn btn-light position-absolute top-0 end-0"
                    style={{ fontSize: '1.5rem', color: '#888', border: 'none' }}
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
}

export default BottomSheet;