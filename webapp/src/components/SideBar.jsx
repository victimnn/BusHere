
const SideBar = ({isOpen, onClickOutside}) => {
	return (
        <>
		<div 
        className="bg-light"
        style={{
            width: '80vw', height: '100vh',
            position: 'fixed',
            top: 0, left: 0,
            zIndex: 2000,
            overflowY: 'auto',
            transition: 'transform 0.3s ease-in-out',
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
        >
			knee grr
		</div>

        <div
            className="bg-dark"
            style={{
               opacity: isOpen ? 0.5 : 0,
               width: '100vw', height: '100vh',
               position: 'fixed',
               top: 0, left: 0,
               zIndex: isOpen ? 1999 : -1,
               backdropFilter: isOpen ? 'blur(5px)' : 'none',
               transition: 'opacity 0.3s ease-in-out',
            }}
            onClick={onClickOutside}
        >

        </div>
        </>
	);
};

export default SideBar;
