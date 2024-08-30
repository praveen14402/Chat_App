import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs';
import { reduceCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import Router from 'next/router'; // Import Router for navigation

function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider();

  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    const coordinates = { x: e.pageX, y: e.pageY + 20 };
    console.log("Context Menu Coordinates:", coordinates); // Debugging
    setContextMenuCoordinates(coordinates);
    setIsContextMenuVisible(true);
  };

  const contextMenuOptions = [{
    name: "Logout",
    callback: async () => {
      setIsContextMenuVisible(false);
      Router.push("/logout");
    },
  }];

  const handleAllContactsPage = () => {
    dispatch({ type: reduceCases.SET_ALL_CONTACTS_PAGE });
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          title="Menu"
          onClick={(e) => showContextMenu(e)}
          id="context-opener"
        />
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            coordinates={contextMenuCoordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
}

export default ChatListHeader;
