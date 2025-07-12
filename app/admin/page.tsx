"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import formatNumber from "./functions/formatNumber";
import React, { useEffect, useState } from "react";
import { httpService } from "@/app/functions/httpService";
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import DesktopComponent from "./mediaQuery/desctopComponent";
import MobileComponent from "./mediaQuery/mobileComponent";



const Dashboard = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {isMobile ?
                <MobileComponent />
                :
                <DesktopComponent />
            }
        </>
    )
}

export default Dashboard;