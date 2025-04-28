import React from "react";
import EmptyState from "../UI/EmptyState";

const EmptyChat = () => (
  <EmptyState
    iconName="chatbubble-ellipses-outline"
    title="Cap missatge encara"
    subtitle="Inicia una conversa amb aquest 'match'"
  />
);

export default EmptyChat;