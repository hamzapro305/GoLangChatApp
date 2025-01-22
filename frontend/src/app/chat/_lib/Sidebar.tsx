"use client";

import useLocalStorage from "@/Hooks/useLocalStorage";
import React from "react";

const Sidebar = () => {
    const [_, setToken] = useLocalStorage<string | null>("token", null);
    return <div>Sidebar</div>;
};

export default Sidebar;
