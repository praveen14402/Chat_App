import React, { useEffect, useRef } from "react";

function ContextMenu({ options, coordinates = { x: 0, y: 0 }, contextMenu, setContextMenu }) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target) &&
        event.target.id !== "context-opener"
      ) {
        setContextMenu(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [contextMenu, setContextMenu]);

  const handleClick = (e, callback) => {
    e.stopPropagation();
    setContextMenu(false);
    callback();
  };

  if (!contextMenu) return null; // Return null if the context menu should not be visible

  return (
    <div
      className="bg-dropdown-background fixed py-2 z-[100] shadow-xl rounded"
      ref={contextMenuRef}
      style={{
        top: `${coordinates.y}px`,
        left: `${coordinates.x}px`,
      }}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            onClick={(e) => handleClick(e, callback)}
            className="px-5 py-2 cursor-pointer hover:bg-background-default-hover"
          >
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;



























































// import React, { useEffect, useRef } from "react";

// function ContextMenu({options,cordinates,contextMenu,setContextMenu}) {
//   const contextMenuRef = useRef(null);

//   useEffect(()=>{
//      const handleOutsideClick = (event) => {
//       if(event.target.id !== "context-opener"){
//         if(
//           contextMenuRef.current &&
//           !contextMenuRef.current.contains(event.target)
//         ){
//           setContextMenu(false);
//         }
//       }
//      };
//      document.addEventListener("click",handleOutsideClick);
//      return () =>{
//       document.removeEventListener("click",handleOutsideClick);
//      }
//   },[])

//   const handleClick = (e,callback) =>{
//     e.stopPropagation();
//      setContextMenu(false);
//     callback();
  
    
//   };
//   return (
//   <div className={`bg-dropdown-background fixed py-2 z-[100]  shadow-xl  rounded`}
//   ref={contextMenuRef}
//   style={{
//     top:cordinates.y,
//     left:cordinates.x 
//   }}
  
//   >
//     <ul>
//       {
//         options.map(({name,callback}) =>(
//           <li key={name} onClick={(e)=>handleClick(e,callback)}  className="px-5 py-2 cursor-pointer hover:bg-background-default-hover">
//             <span className="text-white">{name}</span></li>
//         ))
//       }


//     </ul>
//   </div>
//   );
// }

// export default ContextMenu;
