import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';


const BottomSheet = ({ isOpen, onClose, children, minHeight = 20, maxHeight = 80, anchorPoints=[], setAnchorPoint = () => {} }) => {
    
    const sheetRef = React.useRef(null);
    const getMinHeightPx = () => Math.round(window.innerHeight * (minHeight / 100));
    const getMaxHeightPx = () => Math.round(window.innerHeight * (maxHeight / 100));
    const [height, setHeight] = useState(getMinHeightPx());
    const heightRef = React.useRef(height);

    useEffect(() => {
        heightRef.current = height;
        
    }, [height]);
    const [dragging, setDragging] = useState(false);
    const startY = React.useRef(0);
    const startHeight = React.useRef(getMinHeightPx());

    const getClosestAnchor = (height,returnIndex = false) => {
        if (!anchorPoints.length) return 0;
        const anchorPx = anchorPoints.map(p => Math.round(window.innerHeight * (p / 100)));
        const closest = anchorPx.reduce((prev, curr) => {
            return Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev;
        });
        if(returnIndex){
            const index = anchorPx.indexOf(closest);
            return [closest, index]
        }
        return closest;
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
        const minPx = getMinHeightPx();
        const maxPx = getMaxHeightPx();
        newHeight = Math.max(minPx, Math.min(maxPx, newHeight));
        setHeight(newHeight);
    };

    const onDragEnd = () => {
        setDragging(false);
        document.body.style.userSelect = "";
        // Snap to closest anchor if anchorPoints are provided
        if (anchorPoints.length) {
            setHeight(prevHeight => {
                const [snappedHeight, index] = getClosestAnchor(prevHeight, true);
                setAnchorPoint(index);
                return snappedHeight;
            });
        }
    };

    useEffect(() => {
        const handleMove = (e) => onDragMove(e);
        const handleEnd = () => onDragEnd();
        if (dragging) {
            window.addEventListener("mousemove", handleMove);
            window.addEventListener("touchmove", handleMove);
            window.addEventListener("mouseup", handleEnd);
            window.addEventListener("touchend", handleEnd);
        }
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchend", handleEnd);
        };
    }, [dragging]);

    // Snap to closest anchor if anchorPoints change
    useEffect(() => {
        if (anchorPoints.length) {
            setHeight(prevHeight => {
                const snappedHeight = getClosestAnchor(prevHeight);
                return snappedHeight;
            });
        }
    }, [anchorPoints]);

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
                    minHeight: `calc(${minHeight}vh)`,
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


BottomSheet.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
    anchorPoints: PropTypes.arrayOf(PropTypes.number),
    setAnchorPoint: PropTypes.func
};

export default BottomSheet;